import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import "./index.css";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ACCOUNT_TYPES = ["CHECKING", "SAVINGS"];

function Alert({ type = "success", children }) {
  if (!children) return null;
  return <div className={`alert ${type}`}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.login(form.username, form.password);
      onLogin({
        username: response?.username || form.username,
        userType: response?.userType || response?.role || "CUSTOMER",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <header className="public-header">
        <div className="brand">
          <span className="brand-mark">J</span>
          <span>Jump Bank</span>
        </div>
        <span className="secure-label">Secure online banking</span>
      </header>

      <main className="login-layout">
        <section className="hero-copy">
          <p className="eyebrow">BANKING MADE SIMPLE</p>
          <h1>Manage your money with confidence.</h1>
          <p>
            View balances, move funds, and manage your accounts from one
            straightforward dashboard.
          </p>
          <div className="hero-points">
            <div><strong>Fast</strong><span>Real-time account updates</span></div>
            <div><strong>Clear</strong><span>Simple balance overview</span></div>
            <div><strong>Secure</strong><span>Password-protected access</span></div>
          </div>
        </section>

        <form className="login-card" onSubmit={submit}>
          <h2>Sign on</h2>
          <p>Access your Jump Bank accounts.</p>
          <Alert type="error">{error}</Alert>

          <Field label="Username">
            <input
              required
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Field>

          <Field label="Password">
            <input
              required
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>

          <button className="primary full" disabled={loading}>
            {loading ? "Signing on..." : "Sign on"}
          </button>
        </form>
      </main>
    </div>
  );
}

function AccountCard({ title, account, onAction }) {
  return (
    <article className="account-card">
      <div className="account-top">
        <div>
          <span className="account-label">{title}</span>
          <small>Account •••• {String(account?.id ?? "0000").slice(-4)}</small>
        </div>
        <span className="status-dot">Active</span>
      </div>

      <div className="balance">
        <span>Available balance</span>
        <strong>{money.format(Number(account?.balance || 0))}</strong>
      </div>

      <div className="account-actions">
        <button onClick={() => onAction("deposit")}>Deposit</button>
        <button onClick={() => onAction("withdraw")}>Withdraw</button>
      </div>
    </article>
  );
}

function CustomerDashboard({ session, onLogout }) {
  const [customer, setCustomer] = useState(null);
  const [panel, setPanel] = useState("overview");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const data = await api.getCustomer(session.username);
    setCustomer(data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((err) => setError(err.message));
  }, []);

  const total = useMemo(
    () =>
      Number(customer?.checkingAccount?.balance || 0) +
      Number(customer?.savingsAccount?.balance || 0),
    [customer]
  );

  async function run(action) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
      await refresh();
      setMessage("Transaction completed successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <Header username={session.username} onLogout={onLogout} />
      <div className="main-grid">
        <Sidebar panel={panel} setPanel={setPanel} admin={false} />

        <main className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">WELCOME BACK</p>
              <h1>Hello, {session.username}</h1>
            </div>
            <div className="total-card">
              <span>Total balance</span>
              <strong>{money.format(total)}</strong>
            </div>
          </div>

          <Alert>{message}</Alert>
          <Alert type="error">{error}</Alert>

          {panel === "overview" && (
            <>
              <h2 className="section-title">Your accounts</h2>
              <div className="accounts-grid">
                <AccountCard
                  title="Checking"
                  account={customer?.checkingAccount}
                  onAction={(action) => setPanel(`${action}-CHECKING`)}
                />
                <AccountCard
                  title="Savings"
                  account={customer?.savingsAccount}
                  onAction={(action) => setPanel(`${action}-SAVINGS`)}
                />
              </div>
              <section className="info-banner">
                <div>
                  <h3>Move money between accounts</h3>
                  <p>Transfer funds between checking and savings instantly.</p>
                </div>
                <button className="secondary" onClick={() => setPanel("transfer")}>
                  Make a transfer
                </button>
              </section>
            </>
          )}

          {(panel.startsWith("deposit-") || panel.startsWith("withdraw-")) && (
            <MoneyForm
              title={`${panel.startsWith("deposit") ? "Deposit to" : "Withdraw from"} ${panel.split("-")[1].toLowerCase()}`}
              busy={busy}
              onSubmit={(amount) => {
                const [action, type] = panel.split("-");
                return run(() =>
                  action === "deposit"
                    ? api.deposit(session.username, type, amount)
                    : api.withdraw(session.username, type, amount)
                );
              }}
            />
          )}

          {panel === "transfer" && (
            <OwnTransferForm
              busy={busy}
              onSubmit={(fromAccountType, amount) =>
                run(() =>
                  api.transferOwnAccounts(
                    session.username,
                    fromAccountType,
                    amount
                  )
                )
              }
            />
          )}

          {panel === "send" && (
            <CustomerTransferForm
              username={session.username}
              busy={busy}
              onSubmit={(payload) =>
                run(() => api.transferBetweenCustomers(payload))
              }
            />
          )}

          {panel === "account-id" && (
            <AccountIdForm
              busy={busy}
              onSubmit={(accountType, newId) =>
                run(() =>
                  api.updateAccountId(session.username, accountType, newId)
                )
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}

function MoneyForm({ title, onSubmit, busy }) {
  const [amount, setAmount] = useState("");
  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(amount).then(() => setAmount(""));
      }}
    >
      <h2>{title}</h2>
      <p>Enter a positive dollar amount.</p>
      <Field label="Amount">
        <input
          required
          min="0.01"
          step="0.01"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Field>
      <button className="primary" disabled={busy}>
        {busy ? "Processing..." : "Submit"}
      </button>
    </form>
  );
}

function OwnTransferForm({ onSubmit, busy }) {
  const [fromAccountType, setFrom] = useState("CHECKING");
  const [amount, setAmount] = useState("");
  return (
    <form className="form-card" onSubmit={(e) => {
      e.preventDefault();
      onSubmit(fromAccountType, amount).then(() => setAmount(""));
    }}>
      <h2>Transfer between your accounts</h2>
      <Field label="Transfer from">
        <select value={fromAccountType} onChange={(e) => setFrom(e.target.value)}>
          {ACCOUNT_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
      </Field>
      <Field label="Amount">
        <input required min="0.01" step="0.01" type="number" value={amount}
          onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <button className="primary" disabled={busy}>Transfer funds</button>
    </form>
  );
}

function CustomerTransferForm({ username, onSubmit, busy }) {
  const [form, setForm] = useState({
    fromUsername: username,
    toUsername: "",
    fromAccount: "CHECKING",
    toAccount: "CHECKING",
    amount: "",
  });

  return (
    <form className="form-card" onSubmit={(e) => {
      e.preventDefault();
      onSubmit(form).then(() => setForm({ ...form, toUsername: "", amount: "" }));
    }}>
      <h2>Send money to another customer</h2>
      <div className="two-col">
        <Field label="From account">
          <select value={form.fromAccount}
            onChange={(e) => setForm({ ...form, fromAccount: e.target.value })}>
            {ACCOUNT_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
        <Field label="Recipient username">
          <input required value={form.toUsername}
            onChange={(e) => setForm({ ...form, toUsername: e.target.value })} />
        </Field>
        <Field label="Recipient account">
          <select value={form.toAccount}
            onChange={(e) => setForm({ ...form, toAccount: e.target.value })}>
            {ACCOUNT_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
        <Field label="Amount">
          <input required min="0.01" step="0.01" type="number" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </Field>
      </div>
      <button className="primary" disabled={busy}>Send money</button>
    </form>
  );
}

function AccountIdForm({ onSubmit, busy }) {
  const [type, setType] = useState("CHECKING");
  const [newId, setNewId] = useState("");
  return (
    <form className="form-card" onSubmit={(e) => {
      e.preventDefault();
      onSubmit(type, newId).then(() => setNewId(""));
    }}>
      <h2>Update account ID</h2>
      <Field label="Account">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {ACCOUNT_TYPES.map((value) => <option key={value}>{value}</option>)}
        </select>
      </Field>
      <Field label="New numeric ID">
        <input required type="number" value={newId}
          onChange={(e) => setNewId(e.target.value)} />
      </Field>
      <button className="primary" disabled={busy}>Update account ID</button>
    </form>
  );
}

function AdminDashboard({ session, onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [panel, setPanel] = useState("admin");
  const [form, setForm] = useState({ username: "", password: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    setCustomers(await api.getCustomers());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((err) => setError(err.message));
  }, []);

  async function create(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createCustomer(form.username, form.password);
      setForm({ username: "", password: "" });
      setNotice("Customer created.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(username) {
    if (!window.confirm(`Delete ${username}?`)) return;
    try {
      await api.deleteCustomer(username);
      setNotice("Customer deleted.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <Header username={session.username} onLogout={onLogout} />
      <div className="main-grid">
        <Sidebar panel={panel} setPanel={setPanel} admin />
        <main className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">ADMINISTRATION</p>
              <h1>Customer management</h1>
            </div>
          </div>
          <Alert>{notice}</Alert>
          <Alert type="error">{error}</Alert>

          <form className="form-card compact" onSubmit={create}>
            <h2>Create customer</h2>
            <div className="two-col">
              <Field label="Username">
                <input required value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </Field>
              <Field label="Temporary password">
                <input required type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </Field>
            </div>
            <button className="primary">Create customer</button>
          </form>

          <section className="table-card">
            <div className="table-header">
              <h2>Customers</h2>
              <span>{customers.length} total</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>Username</th><th>Checking</th><th>Savings</th><th></th></tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.username}>
                      <td><strong>{customer.username}</strong></td>
                      <td>{money.format(Number(customer.checkingAccount?.balance || 0))}</td>
                      <td>{money.format(Number(customer.savingsAccount?.balance || 0))}</td>
                      <td><button className="danger-link" onClick={() => remove(customer.username)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Header({ username, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="brand">
        <span className="brand-mark">J</span>
        <span>Jump Bank</span>
      </div>
      <div className="header-user">
        <span>{username}</span>
        <button onClick={onLogout}>Sign out</button>
      </div>
    </header>
  );
}

function Sidebar({ panel, setPanel, admin }) {
  const items = admin
    ? [["admin", "Customer management"]]
    : [
        ["overview", "Account overview"],
        ["transfer", "Transfer funds"],
        ["send", "Send money"],
        ["account-id", "Account settings"],
      ];

  return (
    <aside className="sidebar">
      <span className="sidebar-title">MENU</span>
      {items.map(([key, label]) => (
        <button
          key={key}
          className={panel === key ? "active" : ""}
          onClick={() => setPanel(key)}
        >
          {label}
        </button>
      ))}
    </aside>
  );
}

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jump-bank-session"));
    } catch {
      return null;
    }
  });

  function login(nextSession) {
    localStorage.setItem("jump-bank-session", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function logout() {
    localStorage.removeItem("jump-bank-session");
    setSession(null);
  }

  if (!session) return <LoginPage onLogin={login} />;

  const isAdmin = String(session.userType).toUpperCase() === "ADMIN";
  return isAdmin
    ? <AdminDashboard session={session} onLogout={logout} />
    : <CustomerDashboard session={session} onLogout={logout} />;
}
