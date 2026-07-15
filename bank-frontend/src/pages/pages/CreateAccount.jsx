import { useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../api/DataService";
import PageHero from "../components/PageHero";
import Message from "../components/Message";

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

    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await DataService.createCustomer(form.username, form.password);
      setMessage("Your account was created. You can now sign on.");
      setForm({ username: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHero
        eyebrow="OPEN AN ACCOUNT"
        title="Create your Jump Bank profile."
        text="Choose login credentials to create checking and savings access through the backend."
      />

      <section className="content-section">
        <div className="page-width narrow-layout">
          <form className="form-card" onSubmit={submit}>
            <h2>Create account</h2>
            <p className="form-intro">
              This form calls the customer-creation endpoint when the backend is running.
            </p>
            <Message>{message}</Message>
            <Message type="error">{error}</Message>

            <label>
              Username
              <input
                required
                minLength="3"
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
                minLength="4"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
              />
            </label>

            <label>
              Confirm password
              <input
                required
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm({ ...form, confirmPassword: event.target.value })
                }
              />
            </label>

            <button className="button primary full-width" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="form-switch">
              Already have an account? <Link to="/login">Sign on</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
