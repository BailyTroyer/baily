import {
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
  Box,
  Flex,
  Link,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  IconButton,
  HStack,
  Container,
} from "ui";

const Links = [
  {
    label: "Blog",
    href: "http://localhost:3000",
    target: "_blank",
  },
  {
    label: "Fr",
    href: "http://localhost:3001",
    target: "_blank",
  },
];

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const linkBg = useColorModeValue("gray.200", "gray.700");

  const links = () =>
    Links.map(({ label, ...props }, index) => (
      <Link
        _hover={{
          textDecoration: "none",
          bg: linkBg,
        }}
        rounded="md"
        px={2}
        py={1}
        key={index}
        {...props}
      >
        {label}
      </Link>
    ));

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      sx={{
        position: "sticky",
        top: "0",
      }}
      zIndex={3}
    >
      <Container maxW="4xl">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link href="/">
              <Box fontWeight={600}>Baily.io</Box>
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {links()}
            </HStack>
          </HStack>

          <Flex alignItems={"center"} gap={2}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Container>

      {isOpen ? (
        <Box px={4} pb={4} display={{ md: "none" }}>
          <Stack as={"nav"}>{links()}</Stack>
        </Box>
      ) : null}
    </Box>
  );
}
