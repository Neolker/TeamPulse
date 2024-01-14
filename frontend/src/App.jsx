import { Route, Routes } from "react-router-dom";
import AppContainer from "./components/App/AppContainer.jsx";
import NotFound from "./components/NotFound.jsx";
import Account from "./routes/Account.jsx";
import Analytics from "./routes/Analytics.jsx";
import Application from "./routes/Application";
import Company from "./routes/Company.jsx";
import Homepage from "./routes/Homepage";
import Login from "./routes/Login";
import { Register } from "./routes/Register";
import Settings from "./routes/Settings.jsx";

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
