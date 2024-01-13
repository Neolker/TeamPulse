import { useEffect } from "react";
import AppContainer from "../components/App/AppContainer";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { SimpleGrid } from "@mantine/core";
import TaskCard from "../components/App/TaskCard/TaskCard";

export default function Application() {
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
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 3 }}>
        {Array(60)
          .fill(0)
          .map((_, index) => (
            <TaskCard key={index} />
          ))}
      </SimpleGrid>
    </>
  );
}
