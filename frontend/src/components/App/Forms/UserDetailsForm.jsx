import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box } from '@mantine/core';

export function UserDetailsForm({ user, action }) {
  const form = useForm({
    initialValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },

    validate: {
      firstname: (value) => (value.length < 2 ? 'First name too short' : null),
      lastname: (value) => (value.length < 2 ? 'Last name too short' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Box style={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => action(values))}>
        <TextInput
          required
          label="First Name"
          {...form.getInputProps('firstname')}
        />
        <TextInput
          required
          label="Last Name"
          {...form.getInputProps('lastname')}
        />
        <TextInput
          required
          label="Email"
          {...form.getInputProps('email')}
        />
        <Group position="right" mt="md">
          <Button type="submit">Update Details</Button>
        </Group>
      </form>
    </Box>
  );
}