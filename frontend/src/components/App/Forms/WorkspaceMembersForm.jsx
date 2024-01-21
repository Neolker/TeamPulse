import React, { useState, useMemo, useEffect } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  Box,
  Button,
  Card,
  Group,
  Loader,
  MultiSelect,
  Text,
  Badge,
  Stack,
  ActionIcon,
  Container,
  Title,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export default function WorkspaceMembersForm({
  allUsers,
  currentWorkspaceUsers,
  addMember,
  removeMember,
  isLoading,
  owner,
  canEdit,
}) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUserOptions, setAllUserOptions] = useState([]);

  const form = useForm({
    initialValues: {
      user: [],
    },
    validate: {
      user: isNotEmpty("User is required"),
    },
  });

  useEffect(() => {
    if (currentWorkspaceUsers) {
      setSelectedUsers(currentWorkspaceUsers);
      const currentCompanyUserIds = new Set(selectedUsers.map((u) => u.id));
      setAllUserOptions(
        allUsers
          ?.filter((user) => !currentCompanyUserIds.has(user.id))
          .map((user) => {
            return {
              value: user.id,
              label: `${user.firstname} ${user.lastname} (${user.email}) - (${user.role?.name})`,
              user: user,
            };
          })
      );
    }
  }, [currentWorkspaceUsers, allUsers, selectedUsers]);

  const handleSubmit = async (values) => {
    await addMember(values.user);
    form.reset();
  };

  const handleRemoveMember = (user) => {
    modals.openConfirmModal({
      title: "Remove workspace member",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to remove user {user.firstname} {user.lastname}{" "}
          {user.email}? This action is destructive and you will have to contact
          support to restore your data.
        </Text>
      ),
      labels: { confirm: "Remove", cancel: "No don't remove user" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => {
        removeMember(user.id);
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {canEdit && (
        <Container mt="lg">
          <Title order={3} mb="md">
            Add Members
          </Title>
          <Box style={{ maxWidth: 600 }} mx="auto">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <MultiSelect
                label="Select User"
                data={allUserOptions}
                value={form.values.user}
                onChange={(value) => {
                  // Only keep the latest selected user
                  form.setFieldValue("user", [value[value.length - 1]] || null);
                }}
                placeholder="Select a user"
                searchable
                error={form.errors.user}
              />
              <Group justify="flex-end" mt="md">
                <Button type="submit">Add Member</Button>
              </Group>
            </form>
          </Box>
        </Container>
      )}

      <Container mt="lg">
        <Title order={3}>Workspace Members</Title>
        {selectedUsers?.length !== 0 ? (
          selectedUsers?.map((user) => (
            <Card key={user.id} mt="md" radius="md">
              <Group justify="space-between">
                <Stack>
                  <Group>
                    <Text>{`${user.firstname} ${user.lastname}`}</Text>
                    <Badge
                      color={owner.id === user.id ? "orange" : user.role?.color}
                      variant={owner.id === user.id ? "filled" : "light"}
                    >
                      {user.role?.name}
                    </Badge>
                  </Group>
                  <Text> {user.email}</Text>
                </Stack>

                <ActionIcon
                  onClick={() => handleRemoveMember(user)}
                  variant="light"
                  color="red"
                  aria-label="Remove user"
                  size="lg"
                  disabled={owner.id === user.id || !canEdit}
                >
                  <IconTrash
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Group>
            </Card>
          ))
        ) : (
          <Group justify="center" mt="md">
            <Text>No users</Text>
          </Group>
        )}
      </Container>
    </>
  );
}
