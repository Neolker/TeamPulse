import { useState } from "react";
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Text,
} from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { modals } from "@mantine/modals";
import { useAuth } from "../../AuthContext";
import DarkModeToggle from "../../DarkModeToggle/DarkModeToggle";
import AppLogo from "../AppLogo/AppLogo";

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  { icon: IconUser, label: "Account" },
  { icon: IconSettings, label: "Settings" },
];

export default function Navbar() {
  const [active, setActive] = useState(2);
  const { logout } = useAuth();

  const openLogoutModal = () =>
    modals.openConfirmModal({
      title: "Logut",
      centered: true,
      children: <Text size="sm">Are you sure you want to logout ?</Text>,
      labels: { confirm: "Logout", cancel: "No don't logout" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => {
        logout();
      },
    });

  const links = mockdata.map((link, index) => (
    <NavbarLink
      label={link.label}
      icon={link.icon}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <AppLogo />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <DarkModeToggle />
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          onClick={openLogoutModal}
          color="red"
        />
      </Stack>
    </nav>
  );
}
