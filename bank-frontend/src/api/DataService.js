const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

const DataService = {
  login(username, password) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  createCustomer(username, password) {
    return request("/api/customers", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  getCustomer(username) {
    return request(`/api/customers/${encodeURIComponent(username)}`);
  },

  getCustomers() {
    return request("/api/customers");
  },

  deleteCustomer(username) {
    return request(`/api/customers/${encodeURIComponent(username)}`, {
      method: "DELETE",
    });
  },

  deposit(username, accountType, amount) {
    return request(
      `/api/customers/${encodeURIComponent(username)}/accounts/${accountType}/deposit`,
      {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      }
    );
  },

  withdraw(username, accountType, amount) {
    return request(
      `/api/customers/${encodeURIComponent(username)}/accounts/${accountType}/withdraw`,
      {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      }
    );
  },

  transferOwnAccounts(username, fromAccountType, amount) {
    return request(`/api/customers/${encodeURIComponent(username)}/transfer`, {
      method: "POST",
      body: JSON.stringify({
        fromAccountType,
        amount: Number(amount),
      }),
    });
  },

  transferBetweenCustomers(payload) {
    return request("/api/customers/transfer-between-customers", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
      }),
    });
  },

  updateAccountId(username, accountType, newId) {
    return request(
      `/api/customers/${encodeURIComponent(username)}/accounts/${accountType}/id`,
      {
        method: "PATCH",
        body: JSON.stringify({ newId: Number(newId) }),
      }
    );
  },
};

export default DataService;
