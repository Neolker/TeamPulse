import { Container, Paper, SimpleGrid, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCompany } from "../components/App/CompanyContext";
import { CompanyDetailsForm } from "../components/App/Forms/CompanyDetailsForm";
import { CompanyUsersForm } from "../components/App/Forms/CompanyUsersForm";
import { useAuth } from "../components/AuthContext";
import BackButton from "../components/BackButton";

export default function Settings() {
  const { user, users, roles } = useAuth();
  const {
    companies,
    updateCompany,
    createCompany,
    addUserToCompany,
    removeUserFromCompany,
  } = useCompany();
  const navigate = useNavigate();
  const { awid } = useParams();
  const location = useLocation();
  const isEditing = location.pathname.includes(`settings/${awid}`);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (isEditing && awid && companies) {
      const companyToEdit = companies.find((company) => company.awid === awid);
      if (companyToEdit) {
        setCompany(companyToEdit);
      } else setCompany(null);
    }
  }, [awid, isEditing, companies]);

  const handleUpdate = (values) => {
    updateCompany(
      user.session,
      values.awid,
      values.name,
      values.description,
      values.owner_id
    );
    navigate("/company/" + values.awid);
  };

  const handleCreate = (values) => {
    createCompany(
      user.session,
      values.name,
      values.description,
      values.owner_id
    );
    navigate("/app");
  };

  const handleAddMember = async (values) => {
    for (let id of values.user) {
      await addUserToCompany(user.session, company.awid, id, [values.role]);
    }
  };
  const handleRemoveMember = (value) => {
    removeUserFromCompany(user.session, company.awid, value);
  };

  return (
    <>
      <BackButton />
      <Container>
        <SimpleGrid cols={1} mb="lg">
          <Paper shadow="xs" radius="md" withBorder p="xl">
            <Title order={3} mb="md">
              {isEditing ? "Update Company Details" : "Create Company"}
            </Title>
            <CompanyDetailsForm
              company={company}
              awid={awid}
              users={users}
              isEditing={isEditing}
              update={(values) => {
                handleUpdate(values);
              }}
              create={(values) => handleCreate(values)}
              superadmin={user.superadmin}
            />
          </Paper>
          {isEditing && (
            <Paper shadow="xs" radius="md" withBorder p="xl">
              <Title order={3} mb="md">
                Update your company members
              </Title>
              {company && users && roles && (
                <CompanyUsersForm
                  currentCompanyUsers={company?.users}
                  allUsers={users}
                  addMember={(values) => handleAddMember(values)}
                  removeMember={(values) => handleRemoveMember(values)}
                  roles={roles}
                />
              )}
            </Paper>
          )}
        </SimpleGrid>
      </Container>
    </>
  );
}
