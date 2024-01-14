import { useForm } from "@mantine/form";
import { PasswordInput, Button, Group, Box } from "@mantine/core";

export function UserPasswordForm({ action }) {
  const form = useForm({
    initialValues: {
      password: "",
    },

    validate: {
      password: (value) => (value.length < 6 ? "Password should include at least 6 characters" : null),
    },
  });

  return (
    <Box style={{ maxWidth: 400 }} mx="auto" mt="xl">
      <form onSubmit={form.onSubmit((values) => action(values))}>
        <PasswordInput
          label="Password"
          placeholder="Your new password"
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          error={
            form.errors.password &&
            "Password should include at least 6 characters"
          }
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
