import React, { useState, useEffect } from "react";
import { Modal, TextInput, Button, Group, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../AuthContext";

function UserInitialPassword() {
  const { user, users, UserUpdate, UserPasswordUpdate } = useAuth(); // Assuming useAuth provides user object and setUser function
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      password: "",
    },
    validate: {
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  useEffect(() => {
    if (user && !user.active) {
      setOpened(true); // Open the modal if the user is inactive
    }
  }, [user, users]);

  const handleSubmit = (values) => {
    console.log({ ...user, active: 1 });
    UserUpdate({ ...user, active: 1 });
    UserPasswordUpdate({ ...user, ...values });

    setOpened(false);
  };

  return (
    <Modal
      opened={opened}
      withCloseButton={false} // Removes the close button
      onClose={() => {}} // No-op function for onClose
      title="Update Your Password"
      closeOnClickOutside={false} // Disables closing modal by clicking outside
      closeOnEscape={false} // Disables closing modal with escape key
    >
      <Title my="md">Hi, {user?.firstname}</Title>
      <Text c="dimmed" mb="md">
        You have been inveted by your company owner, please change your
        password
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="New Password"
          type="password"
          {...form.getInputProps("password")}
          required
        />
        <Group position="right" mt="md">
          <Button type="submit">Update Password</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default UserInitialPassword;
