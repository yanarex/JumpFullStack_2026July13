import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jump-bank-session"));
    } catch {
      return null;
    }
  });

  function handleLogin(nextSession) {
    localStorage.setItem("jump-bank-session", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function handleLogout() {
    localStorage.removeItem("jump-bank-session");
    setSession(null);
  }

  const isAdmin = String(session?.userType || "").toUpperCase() === "ADMIN";

  return (
    <div className="site-shell">
      <Header session={session} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route
          path="/login"
          element={
            session
              ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />
              : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/dashboard"
          element={
            session && !isAdmin
              ? <Dashboard session={session} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin"
          element={
            session && isAdmin
              ? <AdminDashboard session={session} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
