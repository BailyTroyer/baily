import {
  App,
  LogLevel,
  Middleware,
  SlackCommandMiddlewareArgs,
  View,
} from "@slack/bolt";

// https://github.com/seratch/slack-bolt-extensions
import AppRunner from "../../../../utils/SlackReceiver";

export const appRunner = new AppRunner({
  logLevel:
    process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.ERROR,
  signingSecret:
    process.env.SLACK_SIGNING_SECRET || "c2ef2a18b45403ae32135d60f8cb4b97",
  token:
    process.env.SLACK_BOT_TOKEN ||
    "xoxb-4286377687920-4286574438000-LodTa6pOkDpOBPDjuNYK9LhZ",
});

export const app = new App(appRunner.appOptions());

const olaphBlocks = (): View => {
  return {
    type: "modal",
    callback_id: "standup",
    title: {
      type: "plain_text",
      text: "Configure Standup",
    },
    blocks: [
      {
        type: "input",
        block_id: "name",
        element: {
          type: "plain_text_input",
          action_id: "name",
          placeholder: {
            type: "plain_text",
            text: "Enter a name for the stand-up",
          },
          initial_value: "",
        },
        label: {
          type: "plain_text",
          text: "Name",
          emoji: true,
        },
      },
    ],
    submit: {
      type: "plain_text",
      text: "Submit",
    },
  };
};

const olaphCommand: Middleware<SlackCommandMiddlewareArgs> = async (args) => {
  const {
    ack,
    command: { trigger_id },
    client,
  } = args;

  await ack();

  await client.views.open({
    trigger_id,
    view: olaphBlocks(),
  });
};

app.command("/olaph", olaphCommand);

appRunner.setup(app);
