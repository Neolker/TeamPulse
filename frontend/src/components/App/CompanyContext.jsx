import { useState, createContext, useContext, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { notifications } from "@mantine/notifications";

export const CompanyContext = createContext(null);

export const useCompany = () => useContext(CompanyContext);

// eslint-disable-next-line react/prop-types
export const CompanyProvider = ({ children }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const taskStatusOptions = [
    { value: "0", label: "Pending", color: "yellow" },
    { value: "1", label: "In Progress", color: "blue" },
    { value: "2", label: "Done", color: "green" },
  ];

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

  const viewWorkspaces = async (session) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/workspace/view?session=${session}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      console.error("Error viewing workspaces: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const viewTasks = async (session) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/task/view?session=${session}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error viewing tasks: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (task) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const data = await response.json();
        notifications.show({
          title: JSON.stringify(data.error),
          color: "red",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      viewTasks(user.session);
      const data = await response.json();
      notifications.show({
        title: `Task "${data.name}" was created successfully`,
        color: "green",
      });
    } catch (error) {
      console.error("Error creating task: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (task) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/task/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const data = await response.json();
        notifications.show({
          title: JSON.stringify(data.error),
          color: "red",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      viewTasks(user.session);
      const data = await response.json();
      notifications.show({
        title: `Task "${data.name}" was updated successfully`,
        color: "green",
      });
    } catch (error) {
      console.error("Error updating task: ", error);
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
      viewWorkspaces(user.session);
      viewTasks(user.session);
    }
  }, [user]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        workspaces,
        tasks,
        taskStatusOptions,
        isLoading,
        viewCompanies,
        createCompany,
        updateCompany,
        addUserToCompany,
        removeUserFromCompany,
        createTask,
        updateTask,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
