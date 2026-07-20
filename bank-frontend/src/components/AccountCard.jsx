import { useState } from "react";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AccountCard({
  name,
  account,
  onDeposit,
  onWithdraw,
  onTransfer,
  onSend,
  onTransactions,
}) {
  const [showAccountNumber, setShowAccountNumber] =
    useState(false);

  const fullAccountNumber = String(
    account?.id ?? "00000000"
  );

  const hiddenAccountNumber = `••••••${fullAccountNumber.slice(
    -2
  )}`;

  return (
    <article className="account-card">
      <div className="account-card-top">
        <div>
          <p className="eyebrow">
            {name.toUpperCase()} ACCOUNT
          </p>

          <span className="account-name">
            {name} Account
          </span>
        </div>

        <span className="account-status">Active</span>
      </div>

      <div className="account-number-section">
        <div className="account-number-line">
          <span className="account-number-label">
            Account Number:
          </span>

          <strong className="account-number-value">
            {showAccountNumber
              ? fullAccountNumber
              : hiddenAccountNumber}
          </strong>
        </div>

        <button
          type="button"
          className="account-number-toggle"
          onClick={() =>
            setShowAccountNumber((current) => !current)
          }
        >
          {showAccountNumber ? "Hide" : "Show"}
        </button>
      </div>

      <div className="account-balance">
        <span>Available Balance</span>

        <strong>
          {currency.format(
            Number(account?.balance || 0)
          )}
        </strong>
      </div>

      <div className="account-card-actions">
      <button type="button" onClick={onDeposit}>
        Deposit
      </button>

      <button type="button" onClick={onWithdraw}>
        Withdraw
      </button>

      {onTransfer && (
        <button type="button" onClick={onTransfer}>
          Transfer
        </button>
      )}

      {onSend && (
        <button type="button" onClick={onSend}>
          Send Money
        </button>
      )}

      {onTransactions && (
        <button type="button" onClick={onTransactions}>
          Transaction History
        </button>
      )}
    </div>
    </article>
  );
}