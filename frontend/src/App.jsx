import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound.jsx";
import Account from "./routes/Account.jsx";
import Analytics from "./routes/Analytics.jsx";
import Application from "./routes/Application";
import Company from "./routes/Company.jsx";
import Homepage from "./routes/Homepage";
import Login from "./routes/Login";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { Register } from "./routes/Register";
import Settings from "./routes/Settings.jsx";
import Workspace from "./routes/Workspace.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<ProtectedRoute component={Application} />} />
      <Route
        path="/company/:awid"
        element={<ProtectedRoute component={Company} />}
      />
      <Route path="/account" element={<ProtectedRoute component={Account} />} />
      <Route
        path="/analytics"
        element={<ProtectedRoute component={Analytics} />}
      />
      <Route
        path="/settings/:awid?"
        element={<ProtectedRoute component={Settings} />}
      />
      <Route
        path="company/:awid/workspaces/:workspace_id?"
        element={<ProtectedRoute component={Workspace} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
