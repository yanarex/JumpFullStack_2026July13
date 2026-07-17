import AccountNumber from "./AccountNumber";

const currency = new Intl.NumberFormat(
  "en-US",
  {
    style: "currency",
    currency: "USD",
  }
);

export default function AccountCard({
  name,
  account,
  onDeposit,
  onWithdraw,
  onTransfer,
  onTransactions,
}) {
  return (
    <article className="account-card">
      <div className="account-card-heading">
        <div>
          <p className="eyebrow">
            {name} Account
          </p>

          <h2>{name} Account</h2>
        </div>

        <span className="status-badge">
          Active
        </span>
      </div>

      <AccountNumber
        accountId={account?.id}
      />

      <div className="account-balance">
        <span>Available Balance</span>

        <strong>
          {currency.format(
            Number(account?.balance || 0)
          )}
        </strong>
      </div>

      <div className="account-card-actions">
        <button
          type="button"
          onClick={onDeposit}
        >
          Deposit
        </button>

        <button
          type="button"
          onClick={onWithdraw}
        >
          Withdraw
        </button>

        {onTransfer && (
          <button
            type="button"
            onClick={onTransfer}
          >
            Transfer
          </button>
        )}

        {onTransactions && (
          <button
            type="button"
            onClick={onTransactions}
          >
            Transactions
          </button>
        )}
      </div>
    </article>
  );
}