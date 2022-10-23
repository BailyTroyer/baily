import { useState } from "react";

import type { TRPCClientErrorLike } from "@trpc/client";
import { Button, Code, Container, ScaleFade, Text, VStack } from "ui";

import type { ServerRouter } from "../server/routers/_app";
import Footer from "./Footer";
import Layout from "./Layout";
import Nav from "./Navbar";

const ErrorPage = (error: TRPCClientErrorLike<ServerRouter>) => {
  const [showErr, setShowErr] = useState(false);
  return (
    <Layout navbar={<Nav />} footer={<Footer />}>
      <Container
        as="main"
        display="flex"
        flexDir="column"
        flex={1}
        maxW="4xl"
        py={7}
        gap={5}
      >
        <VStack alignItems="flex-start">
          <Text as="h1" fontSize="32">
            Unexpected Error
          </Text>
          <Text as="h3" fontSize="20" margin={0}>
            {error.message ||
              "We have Sentry for this reason. Baily will see soon™"}
          </Text>
          <Button onClick={() => setShowErr((s) => !s)}>
            I&apos;m curious ... show Error
          </Button>
          <ScaleFade initialScale={0.9} in={showErr}>
            <Code fontSize="sm">{JSON.stringify(error.data, null, 2)}</Code>
          </ScaleFade>
        </VStack>
      </Container>
    </Layout>
  );
};

export default ErrorPage;
