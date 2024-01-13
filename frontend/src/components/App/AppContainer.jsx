import {
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Skeleton,
  SimpleGrid,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../../assets/logo/Logo_dark.svg";
import Navbar from "./Navbar/Navbar";
import TaskCard from "./TaskCard/TaskCard";

export default function AppContainer() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image src={logo} alt="TeamPulse Logo" height={35} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
        {/* <AppShell.Section>Navbar header</AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          60 links in a scrollable section
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section>Navbar footer – always at the bottom</AppShell.Section> */}
      </AppShell.Navbar>
      <AppShell.Main>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 3 }}>
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <TaskCard key={index} />
            ))}
        </SimpleGrid>
      </AppShell.Main>
    </AppShell>
  );
}
