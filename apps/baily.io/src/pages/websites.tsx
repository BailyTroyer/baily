import {
  AspectRatio,
  Box,
  Container,
  ExternalLinkIcon,
  Grid,
  GridItem,
  HStack,
  Link,
  Skeleton,
  Text,
  VStack,
} from "ui";

import { trpc } from "../common/trpc";
import ErrorPage from "../components/ErrorPage";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import Nav from "../components/Navbar";
import { AppStatus } from "../server/routers/metadata";

const WebCard = (app: AppStatus) => (
  <GridItem
    h={300}
    w="100%"
    bg={app.status === "OK" ? "green.500" : "red.500"}
    p={3}
    rounded="xl"
  >
    <HStack justifyContent="space-between" alignItems="center">
      <Text as="h1" color="white" fontSize={24} fontWeight={500}>
        {app.name}
      </Text>
      <Link href={app.url} target="_blank" rel="noopener noreferrer">
        <ExternalLinkIcon color="white" w={5} h={5} />
      </Link>
    </HStack>
    <Text as="p" color="white">
      {app.description}
    </Text>
    <AspectRatio ratio={1} maxH="200" mt={3}>
      <Box
        bg="white"
        as="iframe"
        title="baily.fr"
        rounded="xl"
        src={app.url}
        allowFullScreen
      />
    </AspectRatio>
  </GridItem>
);

const Websites = () => {
  const metadata = trpc.useQuery(["metadata.apps"]);
  console.log("metadata: ", metadata);
  const isLoading = metadata.data === undefined && metadata.error === null;

  if (metadata.error) {
    return <ErrorPage {...metadata.error} />;
  }

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
            My sites; and their statuses
          </Text>
          <Text as="h3" fontSize="20" margin={0}>
            Hopefully everything still runs 😅
          </Text>
        </VStack>
        <Grid
          flex={1}
          height="100%"
          templateColumns="repeat(auto-fill, minmax(225px, 1fr))"
          gap={4}
        >
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} h={300} w="100%" p={3} rounded="xl" />
                ))
            : metadata.data.map((app) => <WebCard key={app.name} {...app} />)}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Websites;
