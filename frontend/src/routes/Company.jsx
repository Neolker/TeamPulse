import {
  ActionIcon,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Avatar,
  Divider,
  Badge,
  Loader,
} from "@mantine/core";
import { IconSettings, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompany } from "../components/App/CompanyContext";
import { useAuth } from "../components/AuthContext";
import BackButton from "../components/BackButton";
import { isOwner, isManager } from "../components/App/Utils";

const avatars = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
];

export default function Company() {
  const params = useParams();
  const company_awid = params.awid;
  const { user, users } = useAuth();
  const { companies, isLoading } = useCompany();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    if (!user) {
      // If the user is logged in, redirect to the home page
      navigate("/login");
    }
  }, [user, navigate]);

  const findCompanyByAwidAndUserId = (
    companies,
    awid,
    userId,
    isSuperadmin
  ) => {
    const company = companies.find((company) => company.awid === awid);

    if (!company) {
      return null; // or appropriate response if the company is not found
    }

    if (isSuperadmin) {
      return company; // Superadmin has access to all companies
    }

    const isUserRelated =
      company.owner_id === userId ||
      company.users.some((user) => user.user_id === userId);

    return isUserRelated ? company : null;
  };

  useEffect(() => {
    if (!isLoading && companies && user) {
      setCompany(
        findCompanyByAwidAndUserId(
          companies,
          company_awid,
          user.id,
          user.superadmin
        )
      );
    }
  }, [companies, company_awid, isLoading, user]);

  useEffect(() => {
    if (!isLoading && company && users) {
      setOwner(users.find((user) => user.id === company.owner_id));
    }
  }, [isLoading, company, users]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BackButton />
      <Container fluid>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2, xl: 2 }}>
          <Stack p="md">
            <Title order={1}>{company?.name}</Title>
            <Text>{company?.description}</Text>
            <Text span>
              Owner contact: <Badge color="yellow">{owner?.email}</Badge>
            </Text>
          </Stack>
          <Stack align="flex-end" justify="flex-end">
            {company?.users?.length > 3 ? (
              <Avatar.Group spacing="sm">
                <Avatar src={avatars[0]} radius="xl" />
                <Avatar src={avatars[1]} radius="xl" />
                <Avatar src={avatars[2]} radius="xl" />
                <Avatar radius="xl">+{company?.users.length - 3}</Avatar>
              </Avatar.Group>
            ) : (
              <Avatar radius="xl"> {company?.users.length}</Avatar>
            )}
            {company?.owner_id &&
              (isOwner(company, user?.id, user?.superadmin) ||
                isManager(company, user?.id)) && (
                <>
                  <Link to={""}>
                    <ActionIcon
                      variant="filled"
                      size="xl"
                      radius="md"
                      color="violet"
                      aria-label="Settings"
                    >
                      <IconPlus
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Link>
                  {isOwner(company, user?.id, user?.superadmin) && (
                    <Link to={"/settings/" + company?.awid}>
                      <ActionIcon
                        variant="filled"
                        size="xl"
                        radius="md"
                        color="violet"
                        aria-label="Settings"
                      >
                        <IconSettings
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Link>
                  )}
                </>
              )}
          </Stack>
        </SimpleGrid>

        <Divider mt="lg" />

        <Title order={2} p="md">
          Workspace / Workspaces
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2, xl: 2 }}></SimpleGrid>
      </Container>
    </>
  );
}
