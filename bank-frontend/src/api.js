const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
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

export const api = {
  login: (username, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getCustomer: (username) =>
    request(`/api/customers/${encodeURIComponent(username)}`),

  getCustomers: () => request("/api/customers"),

  createCustomer: (username, password) =>
    request("/api/customers", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  deleteCustomer: (username) =>
    request(`/api/customers/${encodeURIComponent(username)}`, {
      method: "DELETE",
    }),

  deposit: (username, accountType, amount) =>
    request(
      `/api/customers/${encodeURIComponent(username)}/accounts/${accountType}/deposit`,
      {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      }
    ),

  withdraw: (username, accountType, amount) =>
    request(
      `/api/customers/${encodeURIComponent(username)}/accounts/${accountType}/withdraw`,
      {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      }
    ),

  transferOwnAccounts: (username, fromAccountType, amount) =>
    request(`/api/customers/${encodeURIComponent(username)}/transfer`, {
      method: "POST",
      body: JSON.stringify({
        fromAccountType,
        amount: Number(amount),
      }),
    }),

  transferBetweenCustomers: ({
    fromUsername,
    toUsername,
    fromAccount,
    toAccount,
    amount,
  }) =>
    request("/api/customers/transfer-between-customers", {
      method: "POST",
      body: JSON.stringify({
        fromUsername,
        toUsername,
        fromAccount,
        toAccount,
        amount: Number(amount),
      }),
    }),

  updateAccountId: (username, accountType, newId) =>
    request(
      `/api/customers/${encodeURIComponent(username)}/accounts/${accountType}/id`,
      {
        method: "PATCH",
        body: JSON.stringify({ newId: Number(newId) }),
      }
    ),
};
