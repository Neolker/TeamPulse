import { AppShell, Burger, Group, SimpleGrid, Image, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../../assets/logo/Logo_dark.svg";
import Navbar from "./Navbar/Navbar";

export default function AppContainer({ children }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      // header={{ height: 60 }}
      navbar={{ width: rem("80px"), breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image src={logo} alt="TeamPulse Logo" height={35} />
        </Group>
      </AppShell.Header> */}
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
