import React from "react";
import { Navigate } from "react-router-dom";
import AppContainer from "../components/App/AppContainer";
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect if not authenticated
    return <Navigate to="/login" />;
  }

  return (
    <AppContainer>
      <Component />
    </AppContainer>
  );
};

export default ProtectedRoute;
