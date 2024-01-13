import { useForm } from "@mantine/form";
import { TextInput, Button, Group, Box } from "@mantine/core";

export function UserPasswordForm({ action }) {
  const form = useForm({
    initialValues: {
      password: "",
    },

    validate: {
      password: (value) => (value.length < 6 ? "Password too short" : null),
    },
  });

  return (
    <Box style={{ maxWidth: 300 }} mx="auto" mt="xl">
      <form onSubmit={form.onSubmit((values) => action(values))}>
        <TextInput
          required
          label="Password"
          type="password"
          {...form.getInputProps("password")}
        />
        <Group position="right" mt="md">
          <Button type="submit">Update Password</Button>
        </Group>
      </form>
    </Box>
  );
}

// Usage
// <UserDetailsForm user={currentUser} />
// <PasswordForm />
