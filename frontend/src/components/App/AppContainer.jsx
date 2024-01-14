import { AppShell, Burger, Group, SimpleGrid, Image, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../../assets/logo/Logo_dark.svg";
import Navbar from "./Navbar/Navbar";
import { useMediaQuery } from "@mantine/hooks";
import UserInitialPassword from "./UserInitialPassword";

export default function AppContainer({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const matches = useMediaQuery("(min-width: 48em)");
  return (
    <AppShell
      header={{ height: 60, collapsed: matches }}
      navbar={{
        width: rem("80px"),
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        style={{
          background: "transparent",
          border: "none",
        }}
      >
        <Navbar toggleOpen={toggle} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <UserInitialPassword />
    </AppShell>
  );
}
