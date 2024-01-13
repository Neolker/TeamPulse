import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./routes/Homepage";
import Login from "./routes/Login";
import { Register } from "./routes/Register";
import ErrorPage from "./components/ErrorPage";
import Application from "./routes/Application";
import AppContainer from "./components/App/AppContainer.jsx";

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

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Homepage />} />
        <Route path="/error/:errorCode" element={<ErrorPage />} />
        {/* <Route path='*' element={<Navigate to='/error/404' />} /> */}
      </Routes>
    </div>
  );
};

export default App;
