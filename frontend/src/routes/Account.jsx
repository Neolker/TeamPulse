import { Container, Paper, SimpleGrid, Title } from "@mantine/core";
import { UserDetailsForm } from "../components/App/Forms/UserDetailsForm";
import { UserPasswordForm } from "../components/App/Forms/UserPasswordForm";
import { useAuth } from "../components/AuthContext";

export default function Account() {
  const { user, UserUpdate, UserPasswordUpdate } = useAuth();

  const handleUserUpdate = async (values) => {
    UserUpdate({ ...user, ...values });
  };
  const handleUserPasswordUpdate = async (value) => {
    UserPasswordUpdate({ ...user, ...value });
  };

  return (
    <>
      <Container>
        <Title order={1} p="md">
          Account
        </Title>
        <SimpleGrid cols={1}>
          <Paper shadow="xs" radius="md" withBorder p="xl">
            <Title order={3} mb="md">
              Update your details
            </Title>
            <UserDetailsForm
              user={user}
              action={(values) => handleUserUpdate(values)}
            />
          </Paper>
          <Paper shadow="xs" radius="md" withBorder p="xl">
            <Title order={3}>Update your password</Title>
            <UserPasswordForm
              action={(value) => handleUserPasswordUpdate(value)}
            />
          </Paper>
        </SimpleGrid>
      </Container>
    </>
  );
}
