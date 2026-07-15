import { useState } from "react";
import PageHero from "../components/PageHero";
import Message from "../components/Message";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function submit(event) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <main>
      <PageHero
        eyebrow="CONTACT US"
        title="How can we help?"
        text="Send a message about your Jump Bank account or application experience."
      />

      <section className="content-section">
        <div className="page-width contact-grid">
          <div className="contact-details">
            <h2>Customer support</h2>
            <p>
              This contact page is currently a frontend demonstration. It does
              not send email until a contact endpoint or email service is added.
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
              <strong>Monday–Friday, 8:00 AM–6:00 PM</strong>
            </div>
          </div>

          <form className="form-card" onSubmit={submit}>
            <h2>Send a message</h2>
            <Message>{sent ? "Your demonstration message was submitted." : ""}</Message>
            <label>
              Full name
              <input required name="name" />
            </label>
            <label>
              Email
              <input required type="email" name="email" />
            </label>
            <label>
              Message
              <textarea required rows="6" name="message" />
            </label>
            <button className="button primary" type="submit">Submit message</button>
          </form>
        </div>
      </section>
    </main>
  );
}
