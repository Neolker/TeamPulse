import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useCompany } from "../components/App/CompanyContext";
import { useNavigate } from "react-router-dom";
import { SimpleGrid, Container, Title, Group, Button } from "@mantine/core";
import TaskCard from "../components/App/TaskCard/TaskCard";
import { Link } from "react-router-dom";
import { hasPriviliges, isOwner } from "../components/App/Utils";

export default function Application() {
  const { user } = useAuth();
  const { companies, isLoading } = useCompany();
  const navigate = useNavigate();
  const [filteredCompanies, setFilteredCompanies] = useState(null);

  useEffect(() => {
    if (!user) {
      // If the user is logged in, redirect to the home page
      navigate("/login");
    }
  }, [user, navigate]);

  const filterCompaniesForUser = (companies, userId) => {
    const allcomp = companies;
    return allcomp.filter((company) => {
      const isOwner = company.owner_id === userId;
      const isInUsersArray = company.users.some(
        (user) => user.user_id === userId
      );

      return isOwner || isInUsersArray;
    });
  };

  useEffect(() => {
    if (!isLoading && companies && user) {
      if (user.superadmin) setFilteredCompanies(companies);
      else setFilteredCompanies(filterCompaniesForUser(companies, user.id));
    }
  }, [companies, isLoading, user]);

  return (
    <>
      <Container fluid>
        <Group justify="space-between">
          <Title order={1} p="md">
            Company / Companies
          </Title>
          {user?.superadmin ? (
            <Link to="/settings">
              <Button>Create Company</Button>
            </Link>
          ) : (
            ""
          )}
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3, xl: 3 }}>
          {filteredCompanies?.map((company, index) => (
            <TaskCard
              key={index}
              company={company}
              hasPriviliges={isOwner(company, user.id, user.superadmin)}
            />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}
