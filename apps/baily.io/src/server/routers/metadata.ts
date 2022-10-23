import { createRouter } from "../createRouter";
import { InferQueryOutput } from "./../../common/trpc";

const apps = [
  {
    name: "baily.blog",
    url: "http://localhost:3000",
    description: "My collective consciousness",
  },
  {
    name: "baily.fr",
    url: "http://localhost:3001",
    description: "My french website 🇫🇷",
  },
];

export type AppStatus = InferQueryOutput<"metadata.apps">[0];

export const metadataRouter = createRouter().query("apps", {
  resolve: async () => {
    const response = await Promise.all(
      apps.map(({ url }) => fetch(url).catch(() => ({ statusText: "Error" })))
    );
    const appStatuses = response.map((r, i) => ({
      status: r.statusText,
      ...apps[i],
    }));
    return appStatuses;
  },
});
