import {
  ActionIcon,
  Avatar,
  Badge,
  Container,
  Divider,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Button,
} from "@mantine/core";
import { IconPlus, IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCompany } from "../components/App/CompanyContext";
import { isManager, isOwner } from "../components/App/Utils";
import { useAuth } from "../components/AuthContext";
import BackButton from "../components/BackButton";

const avatars = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
];

export default function Company() {
  const params = useParams();
  const company_awid = params.awid;
  const { user, users } = useAuth();
  const { companies, workspaces, isLoading } = useCompany();
  const [company, setCompany] = useState(null);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [owner, setOwner] = useState(null);

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
    if (!isLoading && companies && user && workspaces && users) {
      const currentCompany = findCompanyByAwidAndUserId(
        companies,
        company_awid,
        user.id,
        user.superadmin
      );
      setCompany(currentCompany);

      if (currentCompany) {
        setOwner(users.find((u) => u.id === currentCompany.owner_id));

        const isCompanyOwnerOrSuperadmin =
          user.superadmin || currentCompany.owner_id === user.id;

        // Filter workspaces based on the company and user role
        const relevantWorkspaces = workspaces
          .filter((ws) => {
            const isUserRelated =
              isCompanyOwnerOrSuperadmin ||
              ws.owner_id === user.id ||
              ws.members.includes(user.id);
            return ws.awid === company_awid && isUserRelated;
          })
          .map((ws) => {
            return {
              ...ws,
              owner:
                users.find((u) => u.id === ws.owner_id)?.firstname +
                " " +
                users.find((u) => u.id === ws.owner_id)?.lastname,
              members: ws.members.map((memberId) => {
                const member = users.find((u) => u.id === memberId);
                return member
                  ? member.firstname + " " + member.lastname
                  : "Unknown";
              }),
            };
          });

        setFilteredWorkspaces(relevantWorkspaces);
      }
    }
  }, [companies, company_awid, isLoading, user, workspaces, users]);

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
          Company Users
        </Title>
        {company?.users?.map((userObj) => (
          <Text key={userObj.user_id}>
            {users.find((u) => u.id === userObj.user_id)?.firstname +
              " " +
              users.find((u) => u.id === userObj.user_id)?.lastname + " " + users.find((u) => u.id === userObj.user_id)?.email}
          </Text>
        ))}

        <Divider mt="lg" />

        <Title order={2} p="md">
          Workspace / Workspaces
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2, xl: 2 }}>
          {filteredWorkspaces.map((workspace) => (
            <div key={workspace.id}>
              <Text>{workspace.name}</Text>
              <Link
                to={"/company/" + workspace.awid + "/workspace/" + workspace.id}
              >
                <Button radius="md">Show details</Button>
              </Link>
            </div>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}
