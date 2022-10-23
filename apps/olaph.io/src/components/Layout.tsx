import { ReactNode } from "react";

import Head from "next/head";
import { Box } from "ui";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" display="flex" flex={1} flexDir="column">
      <Head>
        <title>olaph.io</title>
        <meta name="description" content="Baily's personal site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
    </Box>
  );
}
