import { useEffect, useMemo, useState } from "react";
import DataService from "../api/DataService";
import AccountCard from "../components/AccountCard";
import Message from "../components/Message";

const ACCOUNT_TYPES = ["CHECKING", "SAVINGS"];
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Dashboard({ session }) {
  const [customer, setCustomer] = useState(null);
  const [view, setView] = useState("overview");
  const [selectedAccount, setSelectedAccount] = useState("CHECKING");
  const [amount, setAmount] = useState("");
  const [transfer, setTransfer] = useState({
    fromAccountType: "CHECKING",
    amount: "",
  });
  const [send, setSend] = useState({
    toUsername: "",
    fromAccount: "CHECKING",
    toAccount: "CHECKING",
    amount: "",
  });
  const [accountId, setAccountId] = useState({
    accountType: "CHECKING",
    newId: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const data = await DataService.getCustomer(session.username);
    setCustomer(data);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, [session.username]);

  const total = useMemo(
    () =>
      Number(customer?.checkingAccount?.balance || 0) +
      Number(customer?.savingsAccount?.balance || 0),
    [customer]
  );

  async function run(action, successText) {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await action();
      await refresh();
      setMessage(successText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openMoneyView(nextView, accountType) {
    setSelectedAccount(accountType);
    setAmount("");
    setView(nextView);
    setMessage("");
    setError("");
  }

  return (
    <main className="dashboard-main">
      <div className="page-width dashboard-layout">
        <aside className="dashboard-sidebar">
          <span className="sidebar-label">ONLINE BANKING</span>
          {[
            ["overview", "Account overview"],
            ["transfer", "Transfer funds"],
            ["send", "Send money"],
            ["settings", "Account settings"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={view === key ? "active" : ""}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </aside>

        <section className="dashboard-content">
          <div className="dashboard-heading">
            <div>
              <p className="eyebrow">WELCOME BACK</p>
              <h1>Hello, {session.username}</h1>
            </div>
            <div className="total-balance">
              <span>Total balance</span>
              <strong>{currency.format(total)}</strong>
            </div>
          </div>

          <Message>{message}</Message>
          <Message type="error">{error}</Message>

          {view === "overview" && (
            <>
              <h2>Your accounts</h2>
              <div className="account-grid">
                <AccountCard
                  name="Checking"
                  account={customer?.checkingAccount}
                  onDeposit={() => openMoneyView("deposit", "CHECKING")}
                  onWithdraw={() => openMoneyView("withdraw", "CHECKING")}
                />
                <AccountCard
                  name="Savings"
                  account={customer?.savingsAccount}
                  onDeposit={() => openMoneyView("deposit", "SAVINGS")}
                  onWithdraw={() => openMoneyView("withdraw", "SAVINGS")}
                />
              </div>
            </>
          )}

          {(view === "deposit" || view === "withdraw") && (
            <form
              className="form-card dashboard-form"
              onSubmit={(event) => {
                event.preventDefault();
                run(
                  () =>
                    view === "deposit"
                      ? DataService.deposit(session.username, selectedAccount, amount)
                      : DataService.withdraw(session.username, selectedAccount, amount),
                  `${view === "deposit" ? "Deposit" : "Withdrawal"} completed.`
                ).then(() => setAmount(""));
              }}
            >
              <h2>
                {view === "deposit" ? "Deposit to" : "Withdraw from"}{" "}
                {selectedAccount.toLowerCase()}
              </h2>
              <label>
                Amount
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </label>
              <button className="button primary" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </button>
            </form>
          )}

          {view === "transfer" && (
            <form
              className="form-card dashboard-form"
              onSubmit={(event) => {
                event.preventDefault();
                run(
                  () =>
                    DataService.transferOwnAccounts(
                      session.username,
                      transfer.fromAccountType,
                      transfer.amount
                    ),
                  "Transfer completed."
                ).then(() => setTransfer({ ...transfer, amount: "" }));
              }}
            >
              <h2>Transfer between your accounts</h2>
              <label>
                Transfer from
                <select
                  value={transfer.fromAccountType}
                  onChange={(event) =>
                    setTransfer({
                      ...transfer,
                      fromAccountType: event.target.value,
                    })
                  }
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Amount
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={transfer.amount}
                  onChange={(event) =>
                    setTransfer({ ...transfer, amount: event.target.value })
                  }
                />
              </label>
              <button className="button primary" disabled={loading}>
                Transfer funds
              </button>
            </form>
          )}

          {view === "send" && (
            <form
              className="form-card dashboard-form"
              onSubmit={(event) => {
                event.preventDefault();
                run(
                  () =>
                    DataService.transferBetweenCustomers({
                      fromUsername: session.username,
                      ...send,
                    }),
                  "Money sent successfully."
                ).then(() =>
                  setSend({ ...send, toUsername: "", amount: "" })
                );
              }}
            >
              <h2>Send money to another customer</h2>
              <div className="form-two-column">
                <label>
                  Recipient username
                  <input
                    required
                    value={send.toUsername}
                    onChange={(event) =>
                      setSend({ ...send, toUsername: event.target.value })
                    }
                  />
                </label>
                <label>
                  Amount
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={send.amount}
                    onChange={(event) =>
                      setSend({ ...send, amount: event.target.value })
                    }
                  />
                </label>
                <label>
                  From account
                  <select
                    value={send.fromAccount}
                    onChange={(event) =>
                      setSend({ ...send, fromAccount: event.target.value })
                    }
                  >
                    {ACCOUNT_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Recipient account
                  <select
                    value={send.toAccount}
                    onChange={(event) =>
                      setSend({ ...send, toAccount: event.target.value })
                    }
                  >
                    {ACCOUNT_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="button primary" disabled={loading}>
                Send money
              </button>
            </form>
          )}

          {view === "settings" && (
            <form
              className="form-card dashboard-form"
              onSubmit={(event) => {
                event.preventDefault();
                run(
                  () =>
                    DataService.updateAccountId(
                      session.username,
                      accountId.accountType,
                      accountId.newId
                    ),
                  "Account ID updated."
                ).then(() => setAccountId({ ...accountId, newId: "" }));
              }}
            >
              <h2>Update account ID</h2>
              <label>
                Account
                <select
                  value={accountId.accountType}
                  onChange={(event) =>
                    setAccountId({
                      ...accountId,
                      accountType: event.target.value,
                    })
                  }
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                New numeric ID
                <input
                  required
                  type="number"
                  value={accountId.newId}
                  onChange={(event) =>
                    setAccountId({ ...accountId, newId: event.target.value })
                  }
                />
              </label>
              <button className="button primary" disabled={loading}>
                Update account
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
