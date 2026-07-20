import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Transactions from "./pages/Transactions";
import AdminCustomerTransactions from "./pages/AdminCustomerTransactions";
import NotFound from "./pages/NotFound";

function readStoredSession() {
  try {
    const storedSession =
      localStorage.getItem("bankSession");

    return storedSession
      ? JSON.parse(storedSession)
      : null;
  } catch {
    return null;
  }
}

function normalizeRole(session) {
  return String(
    session?.userType || session?.role || ""
  )
    .replace("ROLE_", "")
    .toUpperCase();
}

function ProtectedCustomerRoute({
  session,
  children,
}) {
  if (!session?.token) {
    return <Navigate to="/login" replace />;
  }

  if (normalizeRole(session) === "ADMIN") {
    return (
      <Navigate
        to="/admin-dashboard"
        replace
      />
    );
  }

  return children;
}

function ProtectedAdminRoute({
  session,
  children,
}) {
  if (!session?.token) {
    return <Navigate to="/login" replace />;
  }

  if (normalizeRole(session) !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  const [session, setSession] = useState(
    readStoredSession
  );

  function handleLogin(loginResponse) {
    const newSession = {
      username: loginResponse.username,
      userType:
        loginResponse.userType ||
        loginResponse.role ||
        "CUSTOMER",
      token: loginResponse.token,
    };

    localStorage.setItem(
      "bankSession",
      JSON.stringify(newSession)
    );

    setSession(newSession);
  }

  function handleLogout() {
    localStorage.removeItem("bankSession");
    setSession(null);
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header
          session={session}
          onLogout={handleLogout}
        />

        <main className="site-main">
          <Routes>
            <Route
            path="/"
            element={<Home session={session} />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="/create-account"
              element={<CreateAccount />}
            />

            <Route
              path="/login"
              element={
                session?.token ? (
                  normalizeRole(session) ===
                  "ADMIN" ? (
                    <Navigate
                      to="/admin-dashboard"
                      replace
                    />
                  ) : (
                    <Navigate
                      to="/dashboard"
                      replace
                    />
                  )
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedCustomerRoute
                  session={session}
                >
                  <Dashboard session={session} />
                </ProtectedCustomerRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <ProtectedCustomerRoute
                  session={session}
                >
                  <Transactions session={session} />
                </ProtectedCustomerRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedAdminRoute
                  session={session}
                >
                  <AdminDashboard
                    session={session}
                  />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/customers/:username/transactions"
              element={
                <ProtectedAdminRoute
                  session={session}
                >
                  <AdminCustomerTransactions />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute session={session}>
                  <Navigate to="/admin-dashboard" replace />
                </ProtectedAdminRoute>
              }
            />
              <Route
              path="/admin"
              element={<Navigate to="/admin-dashboard" replace />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}