import { IncomingMessage, ServerResponse } from "http";

import {
  App,
  CodedError,
  ReceiverEvent,
  HTTPModuleFunctions as httpFunc,
  HTTPResponseAck,
  BufferedIncomingMessage,
  ReceiverDispatchErrorHandlerArgs,
  ReceiverProcessEventErrorHandlerArgs,
  ReceiverUnhandledRequestHandlerArgs,
  Authorize,
  AppOptions,
  Receiver,
  AuthorizeResult,
  InstallProviderOptions,
  InstallURLOptions,
} from "@slack/bolt";
import { ConsoleLogger, Logger, LogLevel } from "@slack/logger";
import {
  CallbackOptions,
  InstallPathOptions,
  InstallProvider,
} from "@slack/oauth";
import { WebClient, WebClientOptions } from "@slack/web-api";

interface InstallerOptions {
  stateStore?: InstallProviderOptions["stateStore"]; // default ClearStateStore
  stateVerification?: InstallProviderOptions["stateVerification"]; // defaults true
  authVersion?: InstallProviderOptions["authVersion"]; // default 'v2'
  metadata?: InstallURLOptions["metadata"];
  installPath?: string;
  directInstall?: boolean; // see https://api.slack.com/start/distributing/directory#direct_install
  renderHtmlForInstallPath?: (url: string) => string;
  redirectUriPath?: string;
  installPathOptions?: InstallPathOptions;
  callbackOptions?: CallbackOptions;
  userScopes?: InstallURLOptions["userScopes"];
  clientOptions?: InstallProviderOptions["clientOptions"];
  authorizationUrl?: InstallProviderOptions["authorizationUrl"];
}

interface AppRunnerOptions {
  signingSecret: string | (() => PromiseLike<string>);
  token?: string;
  webClientOptions?: WebClientOptions;
  logger?: Logger;
  logLevel?: LogLevel;
  signatureVerification?: boolean;
  processBeforeResponse?: boolean;
  clientId?: string;
  clientSecret?: string;
  stateSecret?: InstallProviderOptions["stateSecret"]; // required when using default stateStore
  redirectUri?: string;
  installerOptions?: InstallerOptions;
  installationStore?: InstallProviderOptions["installationStore"]; // default MemoryInstallationStore
  scopes?: InstallURLOptions["scopes"];
  customPropertiesExtractor?: (
    request: BufferedIncomingMessage
  ) => Record<string, any>;
  dispatchErrorHandler?: (
    args: ReceiverDispatchErrorHandlerArgs
  ) => Promise<void>;
  processEventErrorHandler?: (
    args: ReceiverProcessEventErrorHandlerArgs
  ) => Promise<boolean>;
  // For the compatibility with HTTPResponseAck, this handler is not async
  unhandledRequestHandler?: (args: ReceiverUnhandledRequestHandlerArgs) => void;
  unhandledRequestTimeoutMillis?: number;
}

type Authorization = Partial<AuthorizeResult> & {
  botToken: Required<AuthorizeResult>["botToken"];
};

export function runAuthTestForBotToken(
  client: WebClient,
  authorization: Partial<AuthorizeResult> & {
    botToken: Required<AuthorizeResult>["botToken"];
  }
): Promise<{ botUserId: string; botId: string }> {
  return authorization.botUserId !== undefined &&
    authorization.botId !== undefined
    ? Promise.resolve({
        botUserId: authorization.botUserId,
        botId: authorization.botId,
      })
    : client.auth
        .test({ token: authorization.botToken })
        .then((result: any) => ({
          botUserId: result.user_id as string,
          botId: result.bot_id as string,
        }));
}

async function buildAuthorizeResult(
  isEnterpriseInstall: boolean,
  authTestResult: Promise<{ botUserId: string; botId: string }>,
  authorization: Authorization
): Promise<AuthorizeResult> {
  return {
    isEnterpriseInstall,
    botToken: authorization.botToken,
    ...(await authTestResult),
  };
}

function singleAuthorization(
  client: WebClient,
  authorization: Authorization,
  tokenVerificationEnabled: boolean
): Authorize<boolean> {
  // As Authorize function has a reference to this local variable,
  // this local variable can behave as auth.test call result cache for the function
  let cachedAuthTestResult: Promise<{ botUserId: string; botId: string }>;
  if (tokenVerificationEnabled) {
    // call auth.test immediately
    cachedAuthTestResult = runAuthTestForBotToken(client, authorization);
    return async ({ isEnterpriseInstall }) =>
      buildAuthorizeResult(
        isEnterpriseInstall,
        cachedAuthTestResult,
        authorization
      );
  }
  return async ({ isEnterpriseInstall }) => {
    // hold off calling auth.test API until the first access to authorize function
    cachedAuthTestResult = runAuthTestForBotToken(client, authorization);
    return buildAuthorizeResult(
      isEnterpriseInstall,
      cachedAuthTestResult,
      authorization
    );
  };
}

class NOOPReceiver implements Receiver {
  public constructor() {
    // NOOP
  }

  public init(_app: App): void {}

  public async start(..._args: unknown[]): Promise<unknown> {
    return {};
  }

  public async stop(..._args: unknown[]): Promise<unknown> {
    return {};
  }
}

export default class AppRunner {
  private app: App | undefined;

  private token: string | undefined;

  private client: WebClient;

  private logger: Logger;

  private signingSecretProvider: string | (() => PromiseLike<string>);

  private signatureVerification: boolean;

  private processBeforeResponse: boolean;

  private unhandledRequestTimeoutMillis: number;

  private customPropertiesExtractor: (
    request: BufferedIncomingMessage
  ) => Record<string, any>;

  private dispatchErrorHandler: (
    args: ReceiverDispatchErrorHandlerArgs
  ) => Promise<void>;

  private processEventErrorHandler: (
    args: ReceiverProcessEventErrorHandlerArgs
  ) => Promise<boolean>;

  private unhandledRequestHandler: (
    args: ReceiverUnhandledRequestHandlerArgs
  ) => void;

  // ----------------------------

  private installer: InstallProvider | undefined;

  private installerOptions: InstallerOptions | undefined;

  public constructor(options: AppRunnerOptions) {
    this.token = options.token;
    this.client = new WebClient(options.token, options.webClientOptions);
    this.signatureVerification = options.signatureVerification ?? true;
    this.signingSecretProvider = options.signingSecret;
    this.customPropertiesExtractor =
      options.customPropertiesExtractor !== undefined
        ? options.customPropertiesExtractor
        : (_) => ({});
    this.unhandledRequestTimeoutMillis =
      options.unhandledRequestTimeoutMillis ?? 3001;

    this.logger =
      options.logger ??
      (() => {
        const defaultLogger = new ConsoleLogger();
        if (options.logLevel) {
          defaultLogger.setLevel(options.logLevel);
        }
        return defaultLogger;
      })();
    this.processBeforeResponse = options.processBeforeResponse ?? false;
    this.dispatchErrorHandler =
      options.dispatchErrorHandler ?? httpFunc.defaultAsyncDispatchErrorHandler;
    this.processEventErrorHandler =
      options.processEventErrorHandler ??
      httpFunc.defaultProcessEventErrorHandler;
    this.unhandledRequestHandler =
      options.unhandledRequestHandler ??
      httpFunc.defaultUnhandledRequestHandler;

    this.installerOptions = options.installerOptions;
    if (options.clientId && options.clientSecret) {
      this.installer = new InstallProvider({
        ...this.installerOptions,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        stateSecret: options.stateSecret,
        installationStore: options.installationStore,
        logger: options.logger,
        logLevel: options.logLevel,
        installUrlOptions: {
          scopes: options.scopes ?? [],
          userScopes: this.installerOptions?.userScopes,
          metadata: this.installerOptions?.metadata,
          redirectUri: options.redirectUri,
        },
      });
    }
  }

  private _sigingSecret: string | undefined;

  private async signingSecret(): Promise<string> {
    if (this._sigingSecret === undefined) {
      this._sigingSecret =
        typeof this.signingSecretProvider === "string"
          ? this.signingSecretProvider
          : await this.signingSecretProvider();
    }
    return this._sigingSecret;
  }

  public authorize(): Authorize<boolean> {
    if (this.installer) {
      return this.installer.authorize;
    }
    if (this.token) {
      return singleAuthorization(this.client, { botToken: this.token }, false);
    }
    throw new Error("Either token or OAuth settings is required");
  }

  public appOptions(): AppOptions {
    return {
      authorize: this.authorize(),
      receiver: new NOOPReceiver(),
    };
  }

  public setup(app: App): void {
    this.app = app;
  }

  public async handleInstallPath(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      await this.installer?.handleInstallPath(
        req,
        res,
        this.installerOptions?.installPathOptions
      );
    } catch (error) {
      await this.dispatchErrorHandler({
        error: error as Error | CodedError,
        logger: this.logger,
        request: req,
        response: res,
      });
    }
  }

  public async handleCallback(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      await this.installer?.handleCallback(
        req,
        res,
        this.installerOptions?.callbackOptions
      );
    } catch (error) {
      await this.dispatchErrorHandler({
        error: error as Error | CodedError,
        logger: this.logger,
        request: req,
        response: res,
      });
    }
  }

  public async handleEvents(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      // Verify authenticity
      let bufferedReq: BufferedIncomingMessage;
      try {
        bufferedReq = await httpFunc.parseAndVerifyHTTPRequest(
          {
            // If enabled: false, this method returns bufferredReq without verification
            enabled: this.signatureVerification,
            signingSecret: await this.signingSecret(),
          },
          req
        );
      } catch (err) {
        const e = err as any;
        if (this.signatureVerification) {
          this.logger.warn(
            `Failed to parse and verify the request data: ${e.message}`
          );
        } else {
          this.logger.warn(`Failed to parse the request body: ${e.message}`);
        }
        httpFunc.buildNoBodyResponse(res, 401);
        return;
      }

      // Parse request body
      let body: any;
      try {
        body = httpFunc.parseHTTPRequestBody(bufferedReq);
      } catch (err) {
        const e = err as any;
        this.logger.warn(`Malformed request body: ${e.message}`);
        httpFunc.buildNoBodyResponse(res, 400);
        return;
      }

      // Handle SSL checks
      if (body.ssl_check) {
        httpFunc.buildSSLCheckResponse(res);
        return;
      }

      // Handle URL verification
      if (body.type === "url_verification") {
        httpFunc.buildUrlVerificationResponse(res, body);
        return;
      }

      const ack = new HTTPResponseAck({
        logger: this.logger,
        processBeforeResponse: this.processBeforeResponse,
        unhandledRequestHandler: this.unhandledRequestHandler,
        unhandledRequestTimeoutMillis: this.unhandledRequestTimeoutMillis,
        httpRequest: bufferedReq,
        httpResponse: res,
      });
      // Structure the ReceiverEvent
      const event: ReceiverEvent = {
        body,
        ack: ack.bind(),
        retryNum: httpFunc.extractRetryNumFromHTTPRequest(req),
        retryReason: httpFunc.extractRetryReasonFromHTTPRequest(req),
        customProperties: this.customPropertiesExtractor(bufferedReq),
      };

      // Send the event to the app for processing
      try {
        await this.app?.processEvent(event);
        if (ack.storedResponse !== undefined) {
          // in the case of processBeforeResponse: true
          httpFunc.buildContentResponse(res, ack.storedResponse);
          this.logger.debug("stored response sent");
        }
      } catch (error) {
        const acknowledgedByHandler = await this.processEventErrorHandler({
          error: error as Error | CodedError,
          logger: this.logger,
          request: req,
          response: res,
          storedResponse: ack.storedResponse,
        });
        if (acknowledgedByHandler) {
          // If the value is false, we don't touch the value as a race condition
          // with ack() call may occur especially when processBeforeResponse: false
          ack.ack();
        }
      }
    } catch (error) {
      await this.dispatchErrorHandler({
        error: error as Error | CodedError,
        logger: this.logger,
        request: req,
        response: res,
      });
    }
  }
}
