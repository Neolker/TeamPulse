  import {
    ActionIcon,
    Anchor,
    Badge,
    Box,
    Button,
    Group,
    Loader,
    MultiSelect,
    Select,
    Table,
    Text,
    rem,
  } from "@mantine/core";
  import { isNotEmpty, useForm } from "@mantine/form";
  import { modals } from "@mantine/modals";
  import { IconTrash } from "@tabler/icons-react";
  import { useMemo, useState } from "react";
  import UserCreateModal from "./UserCreateModal";

  function UsersTable({ data }) {
    const rows = data.map((item) => (
      <Table.Tr key={item.name}>
        <Table.Td>
          <Group gap="sm">
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>

        <Table.Td>
          <Badge color={item.color} variant="light">
            {item.role}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Anchor component="button" size="sm">
            {item.email}
          </Anchor>
        </Table.Td>
        <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon
              variant="subtle"
              color="red"
              size="lg"
              onClick={item.onClick}
            >
              <IconTrash
                style={{ width: rem(24), height: rem(24) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

    return (
      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Job title</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  }

  export function CompanyUsersForm({
    allUsers,
    currentCompanyUsers,
    roles,
    addMember,
    removeMember,
    isLoading,
  }) {
    const [selectedUsers, setSelectedUsers] = useState(currentCompanyUsers);

    const form = useForm({
      initialValues: {
        user: [],
        role: "1",
      },
      validate: {
        user: isNotEmpty("User is required"),
        role: (value) => (value ? null : "Role is required"),
      },
    });
    const availableUsers = useMemo(() => {
      const currentCompanyUserIds = new Set(selectedUsers.map((u) => u.user_id));
      return allUsers.filter((user) => !currentCompanyUserIds.has(user.id));
    }, [allUsers, selectedUsers]);

    const handleSubmit = async (values) => {
      await addMember(values);
      for (let id of values.user) {
        setSelectedUsers((prevUsers) => [
          ...prevUsers,
          { user_id: id, roles: [values.role] },
        ]);
      }
      form.reset();
    };

    const handleRemove = async (user_id) => {
      modals.openConfirmModal({
        title: "Delete your company member",
        centered: true,
        children: (
          <Text size="sm">
            Are you sure you want to delete your company member? This action is
            destructive and you will have to contact support to restore your data.
          </Text>
        ),
        labels: { confirm: "Delete member", cancel: "No don't delete it" },
        confirmProps: { color: "red" },
        onCancel: () => {},
        onConfirm: async () => {
          console.log(user_id);
          await removeMember(user_id);
          setSelectedUsers((prevUsers) =>
            prevUsers.filter((user) => user.user_id !== user_id)
          );
        },
      });
    };

    const allUserOptions = availableUsers.map((user) => ({
      value: user.id,
      label: `${user.firstname} ${user.lastname} (${user.email})`,
    }));

    const roleOptions = roles.map((role) => ({
      value: role.id,
      label: role.name,
    }));

    if (isLoading) {
      return <Loader />;
    }
    return (
      <>
        <Group justify="flex-end">
          <UserCreateModal />
        </Group>
        <Box style={{ maxWidth: 600 }} mx="auto">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <MultiSelect
              label="Select User"
              data={allUserOptions}
              value={form.values.user}
              onChange={(value) => form.setFieldValue("user", value)}
              placeholder="Select a user"
              searchable
              error={form.errors.user}
            />
            <Select
              label="Select Role"
              data={roleOptions}
              value={form.values.role}
              onChange={(value) => form.setFieldValue("role", value)}
              placeholder="Select a role"
              error={form.errors.role}
            />
            <Group position="right" mt="md" justify="space-between">
              <Button type="submit">Add Member</Button>
            </Group>
          </form>
        </Box>

        <Box mt="lg">
          {selectedUsers.length !== 0 ? (
            <UsersTable
              data={selectedUsers.map((user, index) => {
                return {
                  name:
                    allUsers.find((u) => u.id === user.user_id)?.firstname +
                    " " +
                    allUsers.find((u) => u.id === user.user_id)?.lastname,
                  email: allUsers.find((u) => u.id === user.user_id)?.email,
                  role: roles.find((role) => role.id === user.roles[0])?.name,
                  onClick: () => handleRemove(user.user_id),
                  color: roles.find((role) => role.id === user.roles[0])?.color,
                };
              })}
            />
          ) : (
            <Text>No users</Text>
          )}
        </Box>
      </>
    );
  }
