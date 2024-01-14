import { useState, createContext, useContext, useEffect } from "react";
import { notifications } from "@mantine/notifications";

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [users, setUsers] = useState(null);

  const login = async (user) => {
    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
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
      const data = await response.json();

      sessionStorage.setItem("user", JSON.stringify(data));
      setUser(JSON.parse(sessionStorage.getItem("user")));
      notifications.show({
        title: `Welcome in our Team Pulse`,
        color: "green",
      });
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  const loadUser = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/get?id=${user.id}&session=${user.session}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      sessionStorage.setItem("user", JSON.stringify(data));
      setUser(JSON.parse(sessionStorage.getItem("user")));
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  const loadUsers = async (session) => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/view?session=${session}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  const createUser = async (userDetails) => {
    try {
      const response = await fetch("http://localhost:8000/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: userDetails.session,
          firstname: userDetails.firstname,
          lastname: userDetails.lastname,
          email: userDetails.email,
          password: userDetails.password,
          active: userDetails.active.toString(),
          superadmin: userDetails.superadmin.toString(),
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
      const data = await response.json();
      loadUser(data.session)
      notifications.show({
        title: `User "${data.email}" sucessfully created!`,
        color: "green",
      });
      // Handle additional actions after user creation if necessary
    } catch (error) {
      console.error("Error creating user: ", error);
      notifications.show({
        title: "Error creating user",
        color: "red",
      });
    }
  };
  

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadUsers(user.session);
    }
  }, []);

  const roles = [
    {
      id: "0",
      name: "Project Manager",
      color: "blue"
    },
    {
      id: "1",
      name: "Member",
      color: "green"
    },
    {
      id: "2",
      name: "Client",
      color: "red"
    },
  ];

  return (
    <AuthContext.Provider
      value={{ user, users, login, logout, loadUser, roles, createUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
