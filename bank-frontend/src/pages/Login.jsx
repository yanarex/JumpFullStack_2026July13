import { useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../api/DataService";
import Message from "../components/Message";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await DataService.login(form.username, form.password);
      onLogin({
        username: response?.username || form.username,
        userType: response?.userType || response?.role || "CUSTOMER",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-main">
      <section className="page-width login-grid">
        <div className="login-copy">
          <p className="eyebrow">SECURE ONLINE BANKING</p>
          <h1>Welcome back.</h1>
          <p>
            Sign on to view your balances and manage your Jump Bank accounts.
          </p>
          <div className="security-note">
            <strong>Development note</strong>
            <span>
              Login requires the Spring Boot backend to be running and CORS to
              allow the Vite origin.
            </span>
          </div>
        </div>

        <form className="form-card login-card" onSubmit={submit}>
          <h2>Sign on</h2>
          <Message type="error">{error}</Message>

          <label>
            Username
            <input
              required
              autoComplete="username"
              value={form.username}
              onChange={(event) =>
                setForm({ ...form, username: event.target.value })
              }
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
          </label>

          <button className="button primary full-width" disabled={loading}>
            {loading ? "Signing on..." : "Sign on"}
          </button>

          <p className="form-switch">
            New customer? <Link to="/create-account">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
