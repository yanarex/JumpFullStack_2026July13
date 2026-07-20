/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import DataService from "../api/DataService";
import Message from "../components/Message";
import PasswordField from "../components/PasswordField";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AdminDashboard({ session }) {
  const [customers, setCustomers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
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

  async function refreshContactMessages() {
  const data = await DataService.getContactMessages();

  setContactMessages(
    Array.isArray(data) ? data : []
  );
  }

  async function deleteContactMessage(messageId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await DataService.deleteContactMessage(messageId);

      setContactMessages((currentMessages) =>
        currentMessages.filter(
          (contactMessage) =>
            contactMessage.id !== messageId
        )
      );

      setMessage("Contact message deleted successfully.");
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete the contact message."
      );
    }
  }

  useEffect(() => {
  async function loadAdminData() {
    try {
      await Promise.all([
        refreshCustomers(),
        refreshContactMessages(),
      ]);
    } catch (err) {
      setError(err.message);
    }
  }

  loadAdminData();
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
            <h1>Customer Management</h1>
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
                      <strong>
                      <Link
                        className="customer-name-link"
                        to={`/admin/customers/${encodeURIComponent(
                          customer.username
                        )}/transactions`}>
                        {customer.username}
                      </Link>
                    </strong>
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
                        onClick={() => deleteCustomer(customer.username)}>
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
        <section className="table-card admin-messages-card">
        <div className="table-heading">
          <div>
            <h2>Contact Messages</h2>
            <p>
              Messages submitted through the Contact Us page.
            </p>
          </div>

          <span>
            {contactMessages.length} total
          </span>
        </div>

        <div className="admin-message-list">
          {contactMessages.map((contactMessage) => (
            <article
              className="admin-message"
              key={contactMessage.id}
            >
              <div className="admin-message-heading">
                <div>
                  <strong>
                    {contactMessage.fullName}
                  </strong>

                  <a
                    href={`mailto:${contactMessage.email}`}
                  >
                    {contactMessage.email}
                  </a>
                </div>

                <div className="admin-message-controls">
                  <time>
                    {contactMessage.createdAt
                      ? new Date(
                          contactMessage.createdAt
                        ).toLocaleString()
                      : "Time unavailable"}
                  </time>

                  <button
                    type="button"
                    className="delete-message-button"
                    onClick={() =>
                      deleteContactMessage(contactMessage.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p>{contactMessage.message}</p>
            </article>
          ))}

          {contactMessages.length === 0 && (
            <div className="admin-message-empty">
              No contact messages have been submitted.
            </div>
          )}
        </div>
      </section>
      </div>
    </main>
  );
}
