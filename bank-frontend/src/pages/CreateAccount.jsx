import { useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../api/DataService";
import Message from "../components/Message";
import PasswordField from "../components/PasswordField";

export default function CreateAccount() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const username = form.username.trim();

    if (!username) {
      setError("Username is required.");
      return;
    }

    if (form.password.length < 5) {
      setError("Password must contain at least 5 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await DataService.createCustomer(username, form.password);

      setMessage("Your account was created. You can now sign on.");
      setForm({
        username: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="account-form-page">
      <section className="account-form-card">
        <div className="account-form-heading">
          <p className="eyebrow">OPEN AN ACCOUNT</p>
          <h1>Create account</h1>
          <p>
            Create your username and password to open checking and savings
            accounts.
          </p>
        </div>

        <form onSubmit={submit}>
          <Message>{message}</Message>
          <Message type="error">{error}</Message>

          <label className="form-field">
            <span>Username</span>
            <input
              required
              minLength="3"
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
            minLength={5}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) =>
              setForm({
                ...form,
                password: event.target.value,
              })
            }
          />

          <PasswordField
            label="Confirm password"
            minLength={5}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm({
                ...form,
                confirmPassword: event.target.value,
              })
            }
          />

          <button
            className="button primary full-width account-submit-button"
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="form-switch">
            Already have an account? <Link to="/login">Sign on</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
