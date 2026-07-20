import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
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

function formatTransactionType(type) {
  return String(type || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function Transactions({
  session,
}) {
  const navigate = useNavigate();
  const [searchParams] =
    useSearchParams();

  const selectedAccountType =
    searchParams.get("accountType");

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
          await DataService.getTransactions(
            session.username
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
  }, [session.username]);

  const displayedTransactions =
    useMemo(() => {
      if (!selectedAccountType) {
        return transactions;
      }

      return transactions.filter(
        (transaction) =>
          transaction.accountType ===
          selectedAccountType
      );
    }, [
      transactions,
      selectedAccountType,
    ]);

  return (
    <main className="transactions-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            Online Banking
          </p>

          <h1>Transaction History</h1>

          {selectedAccountType && (
            <p>
              Showing{" "}
              {selectedAccountType ===
              "CHECKING"
                ? "Checking"
                : "Savings"}{" "}
              account transactions.
            </p>
          )}
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
        displayedTransactions.length ===
          0 && (
          <p className="empty-state">
            No transactions were found.
          </p>
        )}

      {!loading &&
        displayedTransactions.length >
          0 && (
          <div className="transaction-list">
            {displayedTransactions.map(
              (transaction) => {
                const amount = Number(
                  transaction.amount || 0
                );

                const isPositive =
                  amount >= 0;

                return (
                  <article
                    className="transaction-row"
                    key={
                      transaction.transactionId
                    }
                  >
                    <div>
                      <h2>
                        {formatTransactionType(
                          transaction.type
                        )}
                      </h2>

                      <p>
                        {transaction.description}
                      </p>

                      {transaction.otherUsername && (
                        <p>
                          Customer:{" "}
                          {
                            transaction.otherUsername
                          }
                        </p>
                      )}

                      {transaction.otherAccountId && (
                        <p>
                          Related Account:{" "}
                          {
                            transaction.otherAccountId
                          }
                        </p>
                      )}

                      <small>
                        {transaction.createdAt
                          ? new Date(
                              transaction.createdAt
                            ).toLocaleString()
                          : ""}
                      </small>
                    </div>

                    <div className="transaction-values">
                      <strong
                        className={
                          isPositive
                            ? "transaction-positive"
                            : "transaction-negative"
                        }
                      >
                        {isPositive ? "+" : ""}
                        {currency.format(amount)}
                      </strong>

                      <span>
                        Balance After:{" "}
                        {currency.format(
                          Number(
                            transaction.balanceAfter ||
                              0
                          )
                        )}
                      </span>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
    </main>
  );
}