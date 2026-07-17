import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import DataService from "../api/DataService";
import Message from "../components/Message";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  async function submit(event) {
    event.preventDefault();

    setError("");

    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const response =
        await DataService.login(
          form.username.trim(),
          form.password
        );

      const loginSession = {
        username:
          response?.username ||
          form.username.trim(),

        userType:
          response?.userType ||
          response?.role ||
          "CUSTOMER",

        token: response?.token,
      };

      if (!loginSession.token) {
        throw new Error(
          "The backend did not return a login token."
        );
      }

      onLogin(loginSession);

      const normalizedRole = String(
        loginSession.userType
      )
        .replace("ROLE_", "")
        .toUpperCase();

      if (normalizedRole === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.message ||
          "Incorrect username or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">
          Secure Online Banking
        </p>

        <h1>Welcome Back</h1>

        <p>
          Log in to view your balances and
          manage your Jump Bank accounts.
        </p>

        <Message type="error">
          {error}
        </Message>

        <form onSubmit={submit}>
          <label htmlFor="login-username">
            Username
          </label>

          <input
            id="login-username"
            type="text"
            value={form.username}
            autoComplete="username"
            onChange={(event) =>
              setForm({
                ...form,
                username: event.target.value,
              })
            }
          />

          <label htmlFor="login-password">
            Password
          </label>

          <div className="password-input-wrapper">
            <input
              id="login-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={form.password}
              autoComplete="current-password"
              onChange={(event) =>
                setForm({
                  ...form,
                  password:
                    event.target.value,
                })
              }
            />

            <button
              type="button"
              className="visibility-button"
              onClick={() =>
                setShowPassword(
                  (current) => !current
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading && (
                <span
                  className="button-spinner"
                  aria-hidden="true"
                />
              )}

              {loading
                ? "Logging In..."
                : "Log In"}
            </button>
          </div>
        </form>

        <p>
          New customer?{" "}
          <Link to="/create-account">
            Create an Account
          </Link>
        </p>
      </div>
    </section>
  );
}