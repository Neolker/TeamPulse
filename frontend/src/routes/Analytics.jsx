import { Badge, Container, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useCompany } from "../components/App/CompanyContext";
import { StatsGridIcons } from "../components/App/StatsGridIcon/StatsGridIcon";
import { StatsSegments } from "../components/App/StatsSegments/StatsSegments";
import { useAuth } from "../components/AuthContext";

export default function Analytics() {
  const { user, users, roles } = useAuth();
  const { companies } = useCompany();
  const [basicStats, setBasicStats] = useState([]);

  useEffect(() => {
    if (users && companies) {
      setBasicStats([
        { title: "Users", value: users.length },
        { title: "Companies", value: companies.length },
      ]);
    }
  }, [users, companies]);

  useEffect(() => {
    let numberOfCompaniesWithUser = 0;
    let totalUsersInInvolvedCompanies = new Set();

    companies.forEach((company) => {
      const isUserInvolved =
        company.owner_id === user?.id ||
        company.users.some((user) => user.user_id === user?.id) ||
        user?.superadmin;

      if (isUserInvolved) {
        numberOfCompaniesWithUser += 1;
        company.users.forEach((user) => {
          totalUsersInInvolvedCompanies.add(user.user_id);
        });
      }
    });

    const owner = companies.reduce((acc, company) => {
      return acc + (company.owner_id === user?.id ? 1 : 0);
    }, 0);

    setBasicStats([
      { title: "Users", value: totalUsersInInvolvedCompanies.size },
      { title: "Companies", value: numberOfCompaniesWithUser },
      { title: "Company Owner", value: owner },
    ]);
  }, [companies, user?.id]);

  const roleNamesById = useMemo(() => {
    return roles.reduce((acc, role) => {
      acc[role.id] = role.name;
      return acc;
    }, {});
  }, [roles]);

  const aggregateRoles = useMemo(() => {
    const roleCounts = {};

    companies.forEach((company) => {
      const isUserInvolved =
        company.owner_id === user.id ||
        company.users.some((user) => user.user_id === user.id) ||
        user.superadmin;

      if (isUserInvolved) {
        company.users.forEach((user) => {
          (user.roles || []).forEach((roleId) => {
            const roleName = roleNamesById[roleId] || "Unknown Role";
            roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
          });
        });
      }
    });

    return roleCounts;
  }, [companies, user.id, roleNamesById, user.superadmin]);

  const rolesData = useMemo(() => {
    const totalRolesCount = Object.values(aggregateRoles).reduce(
      (total, count) => total + count,
      0
    );

    return Object.entries(aggregateRoles).map(([roleName, count]) => {
      const part = Math.round((count / totalRolesCount) * 100);
      const color = roles.find((role) => role.name === roleName)?.color; // Assign or generate a color for each role

      return {
        label: roleName,
        count: count,
        part,
        color,
      };
    });
  }, [aggregateRoles]);

  return (
    <>
      <Container>
        <Title order={1} p="md">
          Analytics for{" "}
          {user?.superadmin ? (
            <Badge size="xl" color="yellow">
              SuperAdmin
            </Badge>
          ) : (
            <Badge size="xl" color="yellow">
              {user?.email}
            </Badge>
          )}
        </Title>
        <Title order={2} p="md">
          {user?.superadmin ? "Stats across whole app" : "Stats"}
        </Title>

        <StatsGridIcons data={basicStats} />

        <Title order={2} p="md">
          {user?.superadmin ? "All roles across all companies" : "Roles"}
        </Title>

        <StatsSegments data={rolesData} />
      </Container>
    </>
  );
}
