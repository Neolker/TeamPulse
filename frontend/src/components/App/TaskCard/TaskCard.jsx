import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Text,
  ActionIcon,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconSettings, IconUsersGroup } from "@tabler/icons-react";
import { isManager } from "../Utils";

const avatars = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
];

export default function TaskCard({ company, isOwner, isManager }) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between">
        <Text c="yellow" fw={700}>
          {company.name}
        </Text>
        {isOwner && (
          <Badge color="orange" size="md">
            Owner
          </Badge>
        )}
        {isManager && (
          <Badge color="yellow" size="md">
            Project Manager
          </Badge>
        )}
      </Group>
      <Text fz="sm" c="dimmed" mt={5}>
        {company.description}
      </Text>

      <Group justify="space-between" mt="md">
        {company.users.length > 3 ? (
          <Avatar.Group spacing="sm">
            <Avatar src={avatars[0]} radius="xl" />
            <Avatar src={avatars[1]} radius="xl" />
            <Avatar src={avatars[2]} radius="xl" />
            <Avatar radius="xl">+{company.users.length - 3}</Avatar>
          </Avatar.Group>
        ) : (
          <Avatar radius="xl"> {company.users.length}</Avatar>
        )}
        <Group>
          {isOwner && (
            <>
              <Link to={"/settings/" + company.awid}>
                <ActionIcon
                  variant="filled"
                  size="lg"
                  radius="md"
                  color="gray"
                  aria-label="Settings"
                >
                  <IconSettings
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Link>
            </>
          )}
          <Link to={"/company/" + company.awid}>
            <Button radius="md">Show details</Button>
          </Link>
        </Group>
      </Group>
    </Card>
  );
}
