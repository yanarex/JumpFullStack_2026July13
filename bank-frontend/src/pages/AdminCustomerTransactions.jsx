import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DataService from "../api/DataService";
import Message from "../components/Message";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AdminCustomerTransactions() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      setError("");

      try {
        const data =
          await DataService.getAdminCustomerTransactions(username);

        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load this customer's transactions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [username]);

  function formatTransactionType(type) {
    return String(type || "Transaction")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return (
    <main className="transactions-page">
      <section className="page-heading transaction-page-heading">
        <div>
          <p className="eyebrow">Administrator</p>

          <h1>{username}'s Transactions</h1>

          <p>
            View the complete transaction history for this
            customer.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          Back to dashboard
        </button>
      </section>

      <Message type="error">{error}</Message>

      {loading && (
        <section className="loading-panel transaction-empty-card">
          <span className="loading-spinner" />
          Loading transactions...
        </section>
      )}

      {!loading && !error && transactions.length === 0 && (
        <section className="transaction-empty-card">
          <h2>No transactions found</h2>

          <p>
            This customer has not completed a deposit,
            withdrawal, or transfer yet.
          </p>
        </section>
      )}

      {!loading && transactions.length > 0 && (
        <section className="transaction-list">
          {transactions.map((transaction, index) => {
            const amount = Number(transaction.amount || 0);

            return (
              <article
                className="transaction-row"
                key={
                  transaction.id ||
                  transaction.createdAt ||
                  index
                }
              >
                <div className="transaction-details">
                  <h2>
                    {formatTransactionType(transaction.type)}
                  </h2>

                  <p>
                    {transaction.description ||
                      "Bank transaction"}
                  </p>

                  <small>
                    {transaction.createdAt
                      ? new Date(
                          transaction.createdAt
                        ).toLocaleString()
                      : "Date unavailable"}
                  </small>
                </div>

                <div className="transaction-values">
                  <strong
                    className={
                      amount >= 0
                        ? "transaction-positive"
                        : "transaction-negative"
                    }
                  >
                    {amount >= 0 ? "+" : ""}
                    {currency.format(amount)}
                  </strong>

                  {transaction.accountType && (
                    <span>
                      {String(
                        transaction.accountType
                      ).replaceAll("_", " ")}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}