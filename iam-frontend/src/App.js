import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>

      {/* HEADER */}
      <div className="header">
        <h1>IAM Threat Detection System</h1>
      </div>

      {/* MAIN */}
      <div className="container">
        <Routes>

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD (PROTECTED) */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
            }
          />

          {/* ADMIN PANEL */}
          <Route
            path="/admin"
            element={
              isLoggedIn ? <Admin /> : <Navigate to="/login" />
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />

        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;