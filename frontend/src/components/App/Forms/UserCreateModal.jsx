import {
  Button,
  Checkbox,
  Group,
  Modal,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useClipboard } from "@mantine/hooks";
import { useAuth } from "../../AuthContext";
import React, { useState } from "react";

export default function UserCreateModal() {
  const [opened, setOpened] = useState(false);
  const [isCredentialsCopied, setIsCredentialsCopied] = useState(false);
  const { copy } = useClipboard();
  const { user, createUser } = useAuth();
  const form = useForm({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      agreement: false,
    },

    validate: {
      firstname: (value) => (value ? null : "Firstname is required"),
      lastname: (value) => (value ? null : "Lastname is required"),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
      agreement: (value) => (value ? null : "You must agree before submitting"),
    },
  });

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-10);
    form.setFieldValue("password", password);
    setIsCredentialsCopied(false);
  };

  const handleButtonClick = (values) => {
    if (!isCredentialsCopied) {
      copy(`Email: ${values.email}\nPassword: ${values.password}`);
      setIsCredentialsCopied(true);
    } else {
      const data = { ...user, ...values, active: 0, superadmin: 0}
      createUser(data)
      setOpened(false);
      setIsCredentialsCopied(false); 
    }
  };

  return (
    <>
      <Button variant="light" onClick={() => setOpened(true)}>
        Create User
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setIsCredentialsCopied(false);
        }}
        title="Create New User"
      >
        <form onSubmit={form.onSubmit((values) => handleButtonClick(values))}>
          <TextInput
            data-autofocus
            label="First Name"
            {...form.getInputProps("firstname")}
          />
          <TextInput label="Last Name" {...form.getInputProps("lastname")} />
          <TextInput label="Email" {...form.getInputProps("email")} />
          <Group grow justify="space-between">
            <PasswordInput
              label="Password"
              type="password"
              {...form.getInputProps("password")}
            />
          </Group>
          <Group justify="space-start" mt="md">
            <Button
              variant="outline"
              color="gray"
              onClick={generatePassword}
              disabled={isCredentialsCopied}
            >
              Generate Password
            </Button>
          </Group>
          <Checkbox
            label="I agree, I create this user with the consent of the owner of this data."
            {...form.getInputProps("agreement", { type: "checkbox" })}
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">
              {isCredentialsCopied ? "Submit" : "Copy Credentials"}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
