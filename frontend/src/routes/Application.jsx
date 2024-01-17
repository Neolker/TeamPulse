import {
  Button,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCompany } from "../components/App/CompanyContext";
import TaskCard from "../components/App/TaskCard/TaskCard";
import { isManager, isOwner } from "../components/App/Utils";
import { useAuth } from "../components/AuthContext";

export default function Application() {
  const { user } = useAuth();
  const { companies, isLoading } = useCompany();
  const [filteredCompanies, setFilteredCompanies] = useState(null);

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
          {filteredCompanies?.length === 0 ? (
            <Text>Not companies yet.</Text>
          ) : (
            filteredCompanies?.map((company, index) => (
              <TaskCard
                key={index}
                company={company}
                isOwner={isOwner(company, user.id, user.superadmin)}
                isManager={isManager(company, user.id)}
              />
            ))
          )}
        </SimpleGrid>
      </Container>
    </>
  );
}
