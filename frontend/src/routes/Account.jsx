import { useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserDetailsForm } from "../components/App/Forms/UserDetailsForm";
import { UserPasswordForm } from "../components/App/Forms/UserPasswordForm";
import { Code, SimpleGrid, Title, Paper, Container } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function Account() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If the user is logged in, redirect to the home page
      navigate("/login");
    }
  }, [user, navigate]);

  const handleUserUpdate = async (values) => {
    try {
      const response = await fetch("http://localhost:8000/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          session: user.session,
          superadmin: user.superadmin.toString(),
          active: user.active.toString(),
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
        }),
      });

      if (!response.ok) {
        notifications.show({
          title: `Update of account details of user: ${user.email} was unsuccessfull`,
          color: "red",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      loadUser(data);

      notifications.show({
        title: `Account details of ${data.email} was updated successfully`,
        color: "green",
      });
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };
  const handleUserPasswordUpdate = async (value) => {
    try {
        const response = await fetch("http://localhost:8000/user/passwd", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
            session: user.session,
            password: value.password,
          }),
        });
  
        if (!response.ok) {
          notifications.show({
            title: `Update of account password of user: ${user.email} was unsuccessfull`,
            color: "red",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        loadUser(data);
  
        notifications.show({
          title: `Account password of ${data.email} was updated successfully`,
          color: "green",
        });
      } catch (error) {
        console.error("Error posting data: ", error);
      }
  };

  return (
    <>
      <Container>
        <Title order={1} p="md">
          Account
        </Title>
        <SimpleGrid cols={1}>
          <Paper shadow="xs" radius="md" withBorder p="xl">
            <Title order={3}>Update your details</Title>
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
