import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If the user is logged in, redirect to the home page
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <Container>
        <Title order={1} p="md">
          Analytics
        </Title>
      </Container>
    </>
  );
}
