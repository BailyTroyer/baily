import { ReactNode } from "react";

import Head from "next/head";
import { Box } from "ui";

interface LayoutProps {
  children: ReactNode;
  navbar?: ReactNode;
  footer?: ReactNode;
}

export default function Layout({
  children,
  navbar = null,
  footer = null,
}: LayoutProps) {
  return (
    <Box minH="100vh" display="flex" flex={1} flexDir="column">
      <Head>
        <title>baily.io</title>
        <meta name="description" content="Baily's personal site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {navbar}

      {children}

      {footer}
    </Box>
  );
}
