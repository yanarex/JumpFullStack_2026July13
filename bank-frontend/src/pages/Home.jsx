import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DataService from "../api/DataService";

export default function Home({ session }) {

  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(false);

  const isCustomer =
    Boolean(session?.username) &&
    String(session?.userType || session?.role || "")
      .replace("ROLE_", "")
      .toUpperCase() === "CUSTOMER";

      useEffect(() => {
        let cancelled = false;

        async function loadCheckingAccount() {
          if (!isCustomer) {
            setCustomer(null);
            return;
          }

          setLoadingAccount(true);

          try {
            const customerData = await DataService.getCustomer(
              session.username
            );

            if (!cancelled) {
              setCustomer(customerData);
            }
          } catch (error) {
            console.error(
              "Unable to load the home-page account:",
              error
            );

            if (!cancelled) {
              setCustomer(null);
            }
          } finally {
            if (!cancelled) {
              setLoadingAccount(false);
            }
        }
    }

    loadCheckingAccount();

    return () => {
      cancelled = true;
    };

  }, [isCustomer, session?.username]);

  const checkingAccount = customer?.checkingAccount;

  const displayedBalance =
    isCustomer && checkingAccount
      ? Number(checkingAccount.balance || 0)
      : 1738.69;

  const displayedAccountName =
    isCustomer && checkingAccount
      ? `${customer.username}'s Checking`
      : "Jump Bank Checking";

  const displayedDescription =
    isCustomer && checkingAccount
      ? "Your checking account is available online."
      : "Everyday banking without the clutter.";

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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

          {isCustomer ? (
          <div className="hero-panel">
            <div className="hero-panel-header">
              <span>{displayedAccountName}</span>

              <span className="mini-pill">
                {loadingAccount ? "Loading" : "Online"}
              </span>
            </div>

            <p>{displayedDescription}</p>

            <div className="mock-balance">
              <span>Available balance</span>

              <strong>
                {loadingAccount
                  ? "Loading..."
                  : currency.format(displayedBalance)}
              </strong>
            </div>

            <div className="mock-actions">
              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard", {
                    state: { view: "deposit" },
                  })
                }
              >
                Deposit
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard", {
                    state: { view: "own-transfer" },
                  })
                }
              >
                Transfer
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard", {
                    state: { view: "external-transfer" },
                  })
                }
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="guest-card-panel">
            <img
              className="guest-bank-card-image"
              src="/images/jump_bank_card.jpg"
              alt="Jump Bank Visa debit card"
            />

            <div className="guest-card-actions">
              <Link
                className="button primary"
                to="/login"
              >
                Log in to view your account
              </Link>

              <Link
                className="button secondary"
                to="/create-account"
              >
                Open an account
              </Link>
            </div>
          </div>
        )} </div>
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
