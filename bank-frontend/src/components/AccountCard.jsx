const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AccountCard({ name, account, onDeposit, onWithdraw }) {
  return (
    <article className="account-card">
      <div className="account-card-top">
        <div>
          <span className="account-name">{name}</span>
          <span className="account-number">
            Account •••• {String(account?.id ?? "0000").slice(-4)}
          </span>
        </div>
        <span className="account-status">Active</span>
      </div>

      <div className="account-balance">
        <span>Available balance</span>
        <strong>{currency.format(Number(account?.balance || 0))}</strong>
      </div>

      <div className="account-actions">
        <button type="button" onClick={onDeposit}>Deposit</button>
        <button type="button" onClick={onWithdraw}>Withdraw</button>
      </div>
    </article>
  );
}
