import { useState, createContext, useContext, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { notifications } from "@mantine/notifications";

export const CompanyContext = createContext(null);

export const useCompany = () => useContext(CompanyContext);

// eslint-disable-next-line react/prop-types
export const CompanyProvider = ({ children }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const viewCompanies = async (session) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/company/view?session=${session}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error viewing companies: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCompany = async (session, name, description, ownerId) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/company/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session, name, description, owner_id: ownerId }),
      });

      if (!response.ok) {
        const data = await response.json();
        notifications.show({
          title: JSON.stringify(data.error),
          color: "red",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      viewCompanies(user.session);
      const data = await response.json();
      notifications.show({
        title: `Company "${data.name}" was created successfully`,
        color: "green",
      });
    } catch (error) {
      console.error("Error creating company: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const getCompany = async (session, awid) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/company/get?session=${session}&awid=${awid}`
  //     );
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error getting company: ", error);
  //   }
  // };

  const updateCompany = async (session, awid, name, description, ownerId) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/company/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session,
          awid,
          name,
          description,
          owner_id: ownerId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        notifications.show({
          title: JSON.stringify(data.error),
          color: "red",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      viewCompanies(user.session);
      const data = await response.json();
      notifications.show({
        title: `Company "${data.name}" was updated successfully`,
        color: "green",
      });
    } catch (error) {
      console.error("Error updating company: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addUserToCompany = async (session, awid, userId, roles) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/company/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session, awid, user_id: userId, roles }),
      });

      if (!response.ok) {
        const data = await response.json();
        notifications.show({
          title: JSON.stringify(data.error),
          color: "red",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await viewCompanies(user.session);
      notifications.show({
        title: `New user was successufully added.`,
        color: "green",
      });
    } catch (error) {
      console.error("Error adding user to company: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeUserFromCompany = async (session, awid, userId) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/company/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session, awid, user_id: userId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        notifications.show({
          title: JSON.stringify(data.error),
          color: "red",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        await viewCompanies(user.session);
      notifications.show({
        title: `User was successsfully removed.`,
        color: "green",
      });
    } catch (error) {
      console.error("Error adding user to company: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      viewCompanies(user.session);
    }
  }, [user]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        isLoading,
        viewCompanies,
        createCompany,
        updateCompany,
        addUserToCompany,
        removeUserFromCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
