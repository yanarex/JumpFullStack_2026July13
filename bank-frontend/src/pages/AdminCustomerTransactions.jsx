import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DataService from "../api/DataService";
import Message from "../components/Message";

const currency = new Intl.NumberFormat(
  "en-US",
  {
    style: "currency",
    currency: "USD",
  }
);

export default function AdminCustomerTransactions() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      setError("");

      try {
        const data =
          await DataService.getAdminCustomerTransactions(
            username
          );

        setTransactions(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [username]);

  return (
    <main className="transactions-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Administrator
          </p>

          <h1>
            {username}&apos;s Transactions
          </h1>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <Message type="error">
        {error}
      </Message>

      {loading && (
        <div className="loading-panel">
          <span className="loading-spinner" />
          Loading transactions...
        </div>
      )}

      {!loading &&
        transactions.length === 0 && (
          <p>No transactions were found.</p>
        )}

      <div className="transaction-list">
        {transactions.map((transaction) => {
          const amount = Number(
            transaction.amount || 0
          );

          return (
            <article
              className="transaction-row"
              key={transaction.transactionId}
            >
              <div>
                <h2>
                  {String(
                    transaction.type || ""
                  ).replaceAll("_", " ")}
                </h2>

                <p>
                  {transaction.description}
                </p>

                <small>
                  {transaction.createdAt
                    ? new Date(
                        transaction.createdAt
                      ).toLocaleString()
                    : ""}
                </small>
              </div>

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
            </article>
          );
        })}
      </div>
    </main>
  );
}