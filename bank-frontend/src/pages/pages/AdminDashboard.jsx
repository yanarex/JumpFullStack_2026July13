import { useEffect, useState } from "react";
import DataService from "../api/DataService";
import Message from "../components/Message";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AdminDashboard({ session }) {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    setCustomers(await DataService.getCustomers());
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, []);

  async function createCustomer(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await DataService.createCustomer(form.username, form.password);
      setForm({ username: "", password: "" });
      setMessage("Customer created.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteCustomer(username) {
    if (!window.confirm(`Delete customer ${username}?`)) return;
    setMessage("");
    setError("");
    try {
      await DataService.deleteCustomer(username);
      setMessage("Customer deleted.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="dashboard-main">
      <div className="page-width admin-layout">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">ADMINISTRATOR</p>
            <h1>Customer management</h1>
            <p>Signed in as {session.username}</p>
          </div>
        </div>

        <Message>{message}</Message>
        <Message type="error">{error}</Message>

        <form className="form-card admin-create" onSubmit={createCustomer}>
          <h2>Create customer</h2>
          <div className="form-two-column">
            <label>
              Username
              <input
                required
                value={form.username}
                onChange={(event) =>
                  setForm({ ...form, username: event.target.value })
                }
              />
            </label>
            <label>
              Temporary password
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
              />
            </label>
          </div>
          <button className="button primary">Create customer</button>
        </form>

        <section className="table-card">
          <div className="table-heading">
            <h2>Customers</h2>
            <span>{customers.length} total</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Checking</th>
                  <th>Savings</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.username}>
                    <td><strong>{customer.username}</strong></td>
                    <td>
                      {currency.format(
                        Number(customer.checkingAccount?.balance || 0)
                      )}
                    </td>
                    <td>
                      {currency.format(
                        Number(customer.savingsAccount?.balance || 0)
                      )}
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteCustomer(customer.username)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
