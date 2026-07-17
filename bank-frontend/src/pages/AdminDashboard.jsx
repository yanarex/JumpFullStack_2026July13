import { useEffect, useState } from "react";
import DataService from "../api/DataService";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";


const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AdminDashboard({ session }) {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({username: "", password: "", userType: "CUSTOMER", });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refreshCustomers() {
  const customerData = await DataService.getCustomers();
  setCustomers(customerData);
}

useEffect(() => {
  async function loadCustomers() {
    try {
      const customerData = await DataService.getCustomers();
      setCustomers(customerData);
    } catch (err) {
      setError(err.message);
    }
  }

  loadCustomers();
}, []);

  async function createUser(event) {
  event.preventDefault();
  setMessage("");
  setError("");

  try {
    await DataService.createUserAsAdmin(
      form.username,
      form.password,
      form.userType
    );
    
    setMessage(
      form.userType === "ADMIN"
        ? "Admin created."
        : "Customer created."
    );

    setForm({
      username: "",
      password: "",
      userType: "CUSTOMER",
    });


    await refreshCustomers();
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
            <p>Logged in as {session.username}</p>
          </div>
        </div>

        <Message>{message}</Message>
        <Message type="error">{error}</Message>

        <form className="form-card admin-create" onSubmit={createUser}>
          <h2>Create account</h2>
          <div className="form-two-column">
            <label>
            User type
            <select
            value={form.userType}
            onChange={(event) =>
            setForm({
            ...form,
            userType: event.target.value,
            })
            }>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
          </select>
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
          <button className="button primary">Create account</button>
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
                  <tr
                    key={customer.username}
                    className="clickable-row"
                    onClick={() =>
                      navigate(
                        `/admin/customers/${customer.username}/transactions`
                      )
                    }>
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
                        onClick={(event) => {
                        event.stopPropagation();
                        deleteCustomer(customer.username);}}>
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
