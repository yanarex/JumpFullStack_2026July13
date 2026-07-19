import { useEffect, useState } from "react";
import DataService from "../api/DataService";
import Message from "../components/Message";
import PasswordField from "../components/PasswordField";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AdminDashboard({ session }) {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    userType: "CUSTOMER",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function refreshCustomers() {
    const customerData = await DataService.getCustomers();
    setCustomers(customerData);
  }

  useEffect(() => {
    refreshCustomers().catch((err) => setError(err.message));
  }, []);

  async function createUser(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await DataService.createUserAsAdmin(
        form.username.trim(),
        form.password,
        form.userType
      );

      setMessage(
        form.userType === "ADMIN"
          ? "Admin created successfully."
          : "Customer created successfully."
      );

      setForm({
        username: "",
        password: "",
        userType: "CUSTOMER",
      });

      await refreshCustomers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCustomer(username) {
    if (!window.confirm(`Delete customer ${username}?`)) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await DataService.deleteCustomer(username);
      setMessage("Customer deleted.");
      await refreshCustomers();
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

        <form className="form-card admin-create" onSubmit={createUser}>
          <h2>Create account</h2>
          <p className="form-intro">
            Create either a customer account or another administrator.
          </p>

          <div className="form-two-column">
            <label className="form-field">
              <span>Username</span>
              <input
                required
                minLength="3"
                autoComplete="off"
                value={form.username}
                onChange={(event) =>
                  setForm({
                    ...form,
                    username: event.target.value,
                  })
                }
              />
            </label>

            <label className="form-field">
              <span>User type</span>
              <select
                value={form.userType}
                onChange={(event) =>
                  setForm({
                    ...form,
                    userType: event.target.value,
                  })
                }
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
          </div>

          <PasswordField
            label="Temporary password"
            minLength={5}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) =>
              setForm({
                ...form,
                password: event.target.value,
              })
            }
          />

          <button
            className="button primary"
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
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
                    <td>
                      <strong>{customer.username}</strong>
                    </td>
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
                        type="button"
                        onClick={() => deleteCustomer(customer.username)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {customers.length === 0 && (
                  <tr>
                    <td colSpan="4">No customers were found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
