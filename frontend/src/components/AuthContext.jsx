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
    },
    {
      id: "1",
      name: "Member",
    },
    {
      id: "2",
      name: "Viewer",
    },
  ];

  return (
    <AuthContext.Provider
      value={{ user, users, login, logout, loadUser, roles }}
    >
      {children}
    </AuthContext.Provider>
  );
};
