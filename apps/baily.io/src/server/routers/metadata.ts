import { createRouter } from "../createRouter";

export const metadataRouter = createRouter().query("apps", {
  resolve: async () => {
    return [];
  },
});
