import { ZodError } from "zod";

import { createRouter } from "../createRouter";
import { metadataRouter } from "./metadata";

export const serverRouter = createRouter()
  // https://trpc.io/docs/v9/error-formatting#adding-custom-formatting
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  })
  .merge("metadata.", metadataRouter);

export type ServerRouter = typeof serverRouter;
