import { Box, Container, Stack, Link, useColorModeValue } from "ui";

export default function Footer() {
  return (
    <footer>
      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}
      >
        <Container
          as={Stack}
          maxW="4xl"
          py={4}
          direction="row"
          spacing={4}
          justify="space-between"
          align={{ base: "center", md: "center" }}
        >
          <Stack direction={"row"} spacing={6}>
            <Link href="/">About</Link>
            <Link href="/contact">Contact</Link>
          </Stack>
          <Link href="/rss">RSS feed</Link>
        </Container>
      </Box>
    </footer>
  );
}
