import { useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../api/DataService";
import Message from "../components/Message";
import PasswordField from "../components/PasswordField";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await DataService.login(
        form.username.trim(),
        form.password
      );

      onLogin({
        username: response?.username || form.username.trim(),
        userType: response?.userType || response?.role || "CUSTOMER",
        token: response?.token,
      });
    } catch (err) {
      setError(err.message || "Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="account-form-page">
      <section className="account-form-card">
        <div className="account-form-heading">
          <p className="eyebrow">SECURE ONLINE BANKING</p>
          <h1>Sign on</h1>
          <p>
            Log in to view your balances and manage your Jump Bank accounts.
          </p>
        </div>

        <form onSubmit={submit}>
          <Message type="error">{error}</Message>

          <label className="form-field">
            <span>Username</span>
            <input
              required
              autoComplete="username"
              value={form.username}
              onChange={(event) =>
                setForm({
                  ...form,
                  username: event.target.value,
                })
              }
            />
          </label>

          <PasswordField
            label="Password"
            value={form.password}
            autoComplete="current-password"
            onChange={(event) =>
              setForm({
                ...form,
                password: event.target.value,
              })
            }
          />

          <button
            className="button primary full-width account-submit-button"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing on..." : "Sign on"}
          </button>

          <p className="form-switch">
            New customer?{" "}
            <Link to="/create-account">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
