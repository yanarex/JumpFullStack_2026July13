import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="page-width hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">BANKING MADE SIMPLE</p>
            <h1>Manage Your Money With Confidence.</h1>
            <p className="hero-text">
              View balances, move funds, and manage everyday accounts through
              one clear online banking experience.
            </p>
            <div className="hero-buttons">
              <Link className="button primary" to="/create-account">
                Open an account
              </Link>
              <Link className="button secondary" to="/about">
                Learn more
              </Link>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-header">
              <span>Jump Bank Checking</span>
              <span className="mini-pill">Online</span>
            </div>
            <p>Everyday banking without the clutter.</p>
            <div className="mock-balance">
              <span>Available balance</span>
              <strong>$1,738.69</strong>
            </div>
            <div className="mock-actions">
              <span>Deposit</span>
              <span>Transfer</span>
              <span>Send</span>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="page-width three-column">
          <article>
            <span className="feature-icon">01</span>
            <h2>Checking Accounts</h2>
            <p>Access balances and complete everyday banking transactions.</p>
          </article>
          <article>
            <span className="feature-icon">02</span>
            <h2>Savings Accounts</h2>
            <p>Keep savings separate while maintaining instant visibility.</p>
          </article>
          <article>
            <span className="feature-icon">03</span>
            <h2>Online Transfers</h2>
            <p>Move money between accounts or send it to another customer.</p>
          </article>
        </div>
      </section>

      <section className="content-section">
        <div className="page-width split-section">
          <div>
            <p className="eyebrow">WHY JUMP BANK</p>
            <h2 className="large-heading">A clearer way to bank online.</h2>
          </div>
          <div className="benefit-list">
            <div>
              <strong>Simple account overview</strong>
              <p>Checking and savings balances appear together in one dashboard.</p>
            </div>
            <div>
              <strong>Useful transaction tools</strong>
              <p>Deposit, withdraw, transfer, and send funds through focused forms.</p>
            </div>
            <div>
              <strong>Built for expansion</strong>
              <p>The React frontend is organized into reusable pages and components.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="page-width cta-inner">
          <div>
            <h2>Ready to get started?</h2>
            <p>Create your Jump Bank customer account.</p>
          </div>
          <Link className="button white" to="/create-account">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
