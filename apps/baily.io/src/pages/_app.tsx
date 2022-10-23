import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import { ChakraProvider } from "ui";

import { ServerRouter } from "../server/routers/_app";

const App: AppType = ({ Component, pageProps }) => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default withTRPC<ServerRouter>({
  config() {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3002/api/trpc";

    return {
      url,
    };
  },
  ssr: true,
})(App);
