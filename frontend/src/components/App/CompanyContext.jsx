import { useState, createContext, useContext, useEffect } from "react";
import { notifications } from "@mantine/notifications";

export const CompanyContext = createContext(null);

export const useCompany = () => useContext(CompanyContext);

// eslint-disable-next-line react/prop-types
export const CompanyProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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

  return (
    <AuthContext.Provider value={{ user, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
