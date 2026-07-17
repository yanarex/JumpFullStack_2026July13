/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import DataService from "../api/DataService";
import AccountCard from "../components/AccountCard";
import Message from "../components/Message";

const ACCOUNT_TYPES = [
  "CHECKING",
  "SAVINGS",
];

const currency = new Intl.NumberFormat(
  "en-US",
  {
    style: "currency",
    currency: "USD",
  }
);

export default function Dashboard({
  session,
}) {
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(null);

  const [view, setView] =
    useState("overview");

  const [
    selectedAccountType,
    setSelectedAccountType,
  ] = useState("CHECKING");

  const [amount, setAmount] =
    useState("");

  const [ownTransfer, setOwnTransfer] =
    useState({
      fromAccountType: "CHECKING",
      amount: "",
    });

  const [externalTransfer, setExternalTransfer] =
    useState({
      fromAccountType: "CHECKING",
      destinationAccountId: "",
      amount: "",
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function refresh() {
    const customerData =
      await DataService.getCustomer(
        session.username
      );

    setCustomer(customerData);
  }

  useEffect(() => {
    refresh().catch((err) => {
      setError(err.message);
    });
  }, [session.username]);

  const totalBalance = useMemo(() => {
    const checkingBalance = Number(
      customer?.checkingAccount?.balance || 0
    );

    const savingsBalance = Number(
      customer?.savingsAccount?.balance || 0
    );

    return (
      checkingBalance + savingsBalance
    );
  }, [customer]);

  async function runTransaction(
    action,
    successMessage
  ) {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await action();
      await refresh();

      setMessage(successMessage);
      setView("overview");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openAccountForm(
    nextView,
    accountType
  ) {
    setSelectedAccountType(accountType);
    setAmount("");
    setMessage("");
    setError("");
    setView(nextView);
  }

  if (!customer && !error) {
    return (
      <main className="dashboard-page">
        <div className="loading-panel">
          <span className="loading-spinner" />
          Loading your accounts...
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <p className="eyebrow">
          Online Banking
        </p>

        <button
          type="button"
          onClick={() =>
            setView("overview")
          }
        >
          Account Overview
        </button>

        <button
          type="button"
          onClick={() =>
            setView("own-transfer")
          }
        >
          Transfer Between Accounts
        </button>

        <button
          type="button"
          onClick={() =>
            setView("external-transfer")
          }
        >
          Send Money
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/transactions")
          }
        >
          Transaction History
        </button>
      </aside>

      <section className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">
              Welcome Back
            </p>

            <h1>
              Hello, {session.username}
            </h1>
          </div>

          <div className="total-balance">
            <span>Total Balance</span>

            <strong>
              {currency.format(
                totalBalance
              )}
            </strong>
          </div>
        </div>

        <Message type="success">
          {message}
        </Message>

        <Message type="error">
          {error}
        </Message>

        {view === "overview" && customer && (
          <div className="account-grid">
            <AccountCard
              name="Checking"
              account={
                customer.checkingAccount
              }
              onDeposit={() =>
                openAccountForm(
                  "deposit",
                  "CHECKING"
                )
              }
              onWithdraw={() =>
                openAccountForm(
                  "withdraw",
                  "CHECKING"
                )
              }
              onTransfer={() =>
                setView(
                  "external-transfer"
                )
              }
              onTransactions={() =>
                navigate(
                  "/transactions?accountType=CHECKING"
                )
              }
            />

            <AccountCard
              name="Savings"
              account={
                customer.savingsAccount
              }
              onDeposit={() =>
                openAccountForm(
                  "deposit",
                  "SAVINGS"
                )
              }
              onWithdraw={() =>
                openAccountForm(
                  "withdraw",
                  "SAVINGS"
                )
              }
              onTransfer={() =>
                setView(
                  "external-transfer"
                )
              }
              onTransactions={() =>
                navigate(
                  "/transactions?accountType=SAVINGS"
                )
              }
            />
          </div>
        )}

        {(view === "deposit" ||
          view === "withdraw") && (
          <form
            className="bank-form"
            onSubmit={(event) => {
              event.preventDefault();

              runTransaction(
                () =>
                  view === "deposit"
                    ? DataService.deposit(
                        session.username,
                        selectedAccountType,
                        amount
                      )
                    : DataService.withdraw(
                        session.username,
                        selectedAccountType,
                        amount
                      ),
                view === "deposit"
                  ? "Deposit completed."
                  : "Withdrawal completed."
              );
            }}
          >
            <h2>
              {view === "deposit"
                ? "Deposit Into"
                : "Withdraw From"}{" "}
              {selectedAccountType ===
              "CHECKING"
                ? "Checking"
                : "Savings"}{" "}
              Account
            </h2>

            <label htmlFor="money-amount">
              Amount
            </label>

            <input
              id="money-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              required
            />

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setView("overview")
                }
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
                  <span className="button-spinner" />
                )}

                {loading
                  ? "Processing..."
                  : "Submit"}
              </button>
            </div>
          </form>
        )}

        {view === "own-transfer" && (
          <form
            className="bank-form"
            onSubmit={(event) => {
              event.preventDefault();

              runTransaction(
                () =>
                  DataService.transferOwnAccounts(
                    session.username,
                    ownTransfer.fromAccountType,
                    ownTransfer.amount
                  ),
                "Transfer completed."
              );
            }}
          >
            <h2>
              Transfer Between Your Accounts
            </h2>

            <label htmlFor="own-transfer-from">
              Transfer From
            </label>

            <select
              id="own-transfer-from"
              value={
                ownTransfer.fromAccountType
              }
              onChange={(event) =>
                setOwnTransfer({
                  ...ownTransfer,
                  fromAccountType:
                    event.target.value,
                })
              }
            >
              {ACCOUNT_TYPES.map(
                (accountType) => (
                  <option
                    key={accountType}
                    value={accountType}
                  >
                    {accountType ===
                    "CHECKING"
                      ? "Checking"
                      : "Savings"}
                  </option>
                )
              )}
            </select>

            <label htmlFor="own-transfer-amount">
              Amount
            </label>

            <input
              id="own-transfer-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={ownTransfer.amount}
              onChange={(event) =>
                setOwnTransfer({
                  ...ownTransfer,
                  amount:
                    event.target.value,
                })
              }
              required
            />

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setView("overview")
                }
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
                  <span className="button-spinner" />
                )}

                {loading
                  ? "Transferring..."
                  : "Transfer Funds"}
              </button>
            </div>
          </form>
        )}

        {view === "external-transfer" && (
          <form
            className="bank-form"
            onSubmit={(event) => {
              event.preventDefault();

              runTransaction(
                () =>
                  DataService.transferToCustomer(
                    session.username,
                    externalTransfer.fromAccountType,
                    externalTransfer.destinationAccountId,
                    externalTransfer.amount
                  ),
                "Money sent successfully."
              );
            }}
          >
            <h2>
              Send Money to Another Account
            </h2>

            <label htmlFor="external-transfer-from">
              Transfer From
            </label>

            <select
              id="external-transfer-from"
              value={
                externalTransfer.fromAccountType
              }
              onChange={(event) =>
                setExternalTransfer({
                  ...externalTransfer,
                  fromAccountType:
                    event.target.value,
                })
              }
            >
              {ACCOUNT_TYPES.map(
                (accountType) => (
                  <option
                    key={accountType}
                    value={accountType}
                  >
                    {accountType ===
                    "CHECKING"
                      ? "Checking"
                      : "Savings"}
                  </option>
                )
              )}
            </select>

            <label htmlFor="destination-account-id">
              Destination Account Number
            </label>

            <input
              id="destination-account-id"
              type="number"
              value={
                externalTransfer.destinationAccountId
              }
              onChange={(event) =>
                setExternalTransfer({
                  ...externalTransfer,
                  destinationAccountId:
                    event.target.value,
                })
              }
              required
            />

            <label htmlFor="external-transfer-amount">
              Amount
            </label>

            <input
              id="external-transfer-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={
                externalTransfer.amount
              }
              onChange={(event) =>
                setExternalTransfer({
                  ...externalTransfer,
                  amount:
                    event.target.value,
                })
              }
              required
            />

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setView("overview")
                }
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
                  <span className="button-spinner" />
                )}

                {loading
                  ? "Sending..."
                  : "Send Money"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}