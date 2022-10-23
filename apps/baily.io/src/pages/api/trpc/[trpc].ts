import * as trpcNext from "@trpc/server/adapters/next";

import { withCors } from "../../../common/withCors";
import { createContext } from "../../../server/context";
import { serverRouter } from "../../../server/routers/_app";

export default withCors(
  trpcNext.createNextApiHandler({
    router: serverRouter,
    createContext,
    onError({ error }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        // send to bug reporting
        console.error("Something went wrong", error);
      }
    },
  })
);
