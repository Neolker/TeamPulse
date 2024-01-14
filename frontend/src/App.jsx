import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./routes/Homepage";
import Login from "./routes/Login";
import { Register } from "./routes/Register";
import ErrorPage from "./components/ErrorPage";
import Application from "./routes/Application";
import AppContainer from "./components/App/AppContainer.jsx";
import Account from "./routes/Account.jsx";
import Analytics from "./routes/Analytics.jsx";
import Settings from "./routes/Settings.jsx";
import Company from "./routes/Company.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route
          path="/app"
          element={
            <AppContainer>
              <Application />
            </AppContainer>
          }
        />
        <Route
          path="/company/:awid"
          element={
            <AppContainer>
              <Company />
            </AppContainer>
          }
        />
        <Route
          path="/account"
          element={
            <AppContainer>
              <Account />
            </AppContainer>
          }
        />
        <Route
          path="/analytics" 
          element={
            <AppContainer>
              <Analytics />
            </AppContainer>
          }
        />
        <Route
          path="/settings/:awid?"
          element={
            <AppContainer>
              <Settings />
            </AppContainer>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="*" element={<Homepage />} /> */}
        <Route path="/error/:errorCode" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Routes>
    </div>
  );
};

export default App;
