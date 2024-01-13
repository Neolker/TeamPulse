import { useState, createContext, useContext, useEffect } from "react";

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? storedUser : null;
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      sessionStorage.setItem("user", data);
      setUser(sessionStorage.getItem("user"));
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  //   useEffect(() => {
  //     const data = sessionStorage.getItem("user");
  //     if (data) {
  //       setUser(data);
  //     }
  //   }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
