import {
  Badge,
  Container,
  Loader,
  Stack,
  Tabs,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { IconList, IconSettings, IconUsers } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCompany } from "../components/App/CompanyContext";
import TasksTab from "../components/App/TasksTab";
import { useAuth } from "../components/AuthContext";
import BackButton from "../components/BackButton";

export default function Workspace() {
  const params = useParams();
  const { awid, workspace_id } = params;
  const { user, users, roles } = useAuth();
  const { companies, workspaces, tasks } = useCompany();
  const [workspace, setWorkspace] = useState(null);
  const [workspaceTasks, setWorkspaceTasks] = useState([]);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAuthorized, setIsUserAuthorized] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchedWorkspace = workspaces.find(
      (ws) => ws.id === workspace_id && ws.awid === awid
    );
    setWorkspace(fetchedWorkspace);

    if (fetchedWorkspace) {
      const company = companies.find((c) => c.awid === awid);
      const isCompanyOwner = company && company.owner_id === user.id;
      const isWorkspaceOwner = fetchedWorkspace.owner_id === user.id;
      const isMember = fetchedWorkspace.members.includes(user.id);
      const canViewAllTasks =
        isCompanyOwner || isWorkspaceOwner || user.superadmin;
      setIsUserAuthorized(canViewAllTasks || isMember);

      // Filter tasks related to this workspace
      const relatedTasks = tasks.filter(
        (task) => task.workspace_id === workspace_id
      );
      const userSpecificTasks = canViewAllTasks
        ? relatedTasks
        : relatedTasks.filter((task) => task.solver_id === user.id);
      setWorkspaceTasks(userSpecificTasks);
    }

    setIsLoading(false);
  }, [awid, workspace_id, user, companies, tasks, workspace, workspaces]);

  useEffect(() => {
    if (workspace && users) {
      let owner = users.find((u) => u.id === workspace.owner_id);

      setOwnerDetails({
        name: owner ? owner.firstname + " " + owner.lastname : "Unknown",
        email: owner ? owner.email : "N/A",
      });
    }
    if (workspace && companies && users) {
      const currentCompany = companies.find((c) => c.awid === workspace.awid);
      if (currentCompany) {
        const allWorkspaceUsers = [...workspace.members, workspace.owner_id];

        const mappedUsers = allWorkspaceUsers.map((memberId) => {
          const userDetail = users.find((u) => u.id === memberId);
          const userRoles =
            currentCompany.users.find((u) => u.user_id === memberId)?.roles ||
            [];
          const roleName = userRoles.map((roleId) =>
            roles.find((r) => r.id === roleId)
          );
          return {
            id: userDetail.id,
            value: memberId,
            label: `${userDetail.firstname} ${userDetail.lastname} (${roleName[0]?.name})`,
            name: userDetail
              ? `${userDetail.firstname} ${userDetail.lastname}`
              : "Unknown",
            email: userDetail.email,
            roles: roleName || "No roles",
          };
        });
        setWorkspaceUsers(mappedUsers);
      }
    }
  }, [workspace, users, roles]);

  if (isLoading) {
    return <Loader />;
  }

  if (!workspace) {
    return <div>No workspace found.</div>;
  }

  if (!isUserAuthorized) {
    return <div>You do not have access to this workspace.</div>;
  }
  const iconStyle = { width: rem(24), height: rem(24) };
  const isProjectManager =
    workspace.owner_id === user.id ||
    user.superadmin ||
    companies.find((c) => c.awid === awid)?.owner_id === user.id;


  return (
    <>
      <BackButton />
      <Container fluid>
        <Stack p="md">
          <Title order={1}>{workspace?.name}</Title>
          <Text>{workspace?.description}</Text>
          <Text span>
            Owner:{" "}
            <b>
              {ownerDetails.name} ({ownerDetails.email})
            </b>
          </Text>

          <Tabs radius="md" defaultValue="tasks">
            <Tabs.List>
              <Tabs.Tab
                value="tasks"
                leftSection={<IconList style={iconStyle} />}
              >
                Tasks
              </Tabs.Tab>
              <Tabs.Tab
                value="users"
                leftSection={<IconUsers style={iconStyle} />}
              >
                Users
              </Tabs.Tab>
              {isProjectManager && (
                <Tabs.Tab
                  value="settings"
                  leftSection={<IconSettings style={iconStyle} />}
                  ml="auto"
                >
                  Settings
                </Tabs.Tab>
              )}
            </Tabs.List>

            <Tabs.Panel value="tasks">
              <TasksTab
                tasks={workspaceTasks}
                canEdit={
                  user.id === workspace.owner_id ||
                  user.superadmin ||
                  user.id === companies.find((c) => c.awid === awid).owner_id ||
                  user.id ===
                    companies
                      .find((c) => c.awid === awid)
                      .users.find((u) => u.user_id === user.id && u.roles[0] === "1")?.user_id
                }
                workspaceUsers={workspaceUsers}
                workspaceId={workspace.id}
                user={user}
              />
            </Tabs.Panel>

            <Tabs.Panel value="users">
              {workspaceUsers.map((user) => (
                <Text key={user.id}>
                  {`${user.name} (${user.email}) - `}
                  <Badge variant="light" color={user.roles[0]?.color}>
                    {user.roles[0]?.name}
                  </Badge>
                  ;
                </Text>
              ))}
            </Tabs.Panel>

            <Tabs.Panel value="settings">
              {isProjectManager && <Text>Settings content here</Text>}
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </>
  );
}
