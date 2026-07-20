import { useState } from "react";

import DataService from "../api/DataService";
import PageHero from "../components/PageHero";
import Message from "../components/Message";

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await DataService.submitContactMessage(
        form.fullName.trim(),
        form.email.trim(),
        form.message.trim()
      );

      setSuccess(
        "Your message was submitted successfully."
      );

      setForm({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Your message could not be submitted."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHero
        eyebrow="Contact us"
        title="Customer support"
        text="Send a message to the Jump Bank support team."
      />

      <section className="content-section">
        <div className="page-width contact-grid">
          <div className="contact-details">
            <h2>We are here to help</h2>

            <p>
              Submit the contact form and a Jump Bank
              administrator will be able to review your
              message.
            </p>

            <div className="contact-item">
              <span>Phone</span>
              <strong>(321) 555-0138</strong>
            </div>

            <div className="contact-item">
              <span>Email</span>
              <strong>support@jumpbank.example</strong>
            </div>

            <div className="contact-item">
              <span>Hours</span>
              <strong>
                Monday–Friday, 8:00 AM–6:00 PM
              </strong>
            </div>
          </div>

          <form className="form-card" onSubmit={submit}>
            <h2>Send a message</h2>

            <p className="form-intro">
              Enter your information and message below.
            </p>

            <Message type="success">{success}</Message>
            <Message type="error">{error}</Message>

            <label>
              Full name

              <input
                required
                value={form.fullName}
                onChange={(event) =>
                  setForm({
                    ...form,
                    fullName: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Email

              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Message

              <textarea
                required
                rows="6"
                value={form.message}
                onChange={(event) =>
                  setForm({
                    ...form,
                    message: event.target.value,
                  })
                }
              />
            </label>

            <button
              className="button primary full-width"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}