import Link from "next/link";
import { Button, Center, Container, Text, VStack } from "ui";

import Layout from "../components/Layout";
import Nav from "../components/Navbar";

const NotFound = () => {
  return (
    <Layout navbar={<Nav />}>
      <Container as="main" display="flex" flex={1} centerContent>
        <Center display="flex" flex={1}>
          <VStack>
            <Text fontSize="3xl">Not Found</Text>
            <Link passHref href="/">
              <Button>Go Home</Button>
            </Link>
          </VStack>
        </Center>
      </Container>
    </Layout>
  );
};

export default NotFound;
