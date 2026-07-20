const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

function getStoredSession() {
  try {
    const storedSession = localStorage.getItem("bankSession");

    if (!storedSession) {
      return null;
    }

    return JSON.parse(storedSession);
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const session = getStoredSession();
  const token = session?.token;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Could not connect to the backend. Make sure Spring Boot is running on port 8080."
    );
  }

  const responseText = await response.text();

  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        typeof responseData === "string"
          ? responseData
          : "Incorrect username or password"
      );
    }

    if (response.status === 403) {
      throw new Error(
        "You do not have permission to perform this action."
      );
    }

    const message =
      responseData?.message ||
      responseData?.error ||
      (typeof responseData === "string"
        ? responseData
        : null) ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return responseData;
}

const DataService = {
  login(username, password) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
  },

  createCustomer(username, password) {
    return request("/api/customers", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
  },

  getCustomer(username) {
    return request(
      `/api/customers/${encodeURIComponent(username)}`
    );
  },

  getCustomers() {
    return request("/api/customers");
  },

  deposit(username, accountType, amount) {
    return request(
      `/api/customers/${encodeURIComponent(
        username
      )}/accounts/${accountType}/deposit`,
      {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
        }),
      }
    );
  },

  withdraw(username, accountType, amount) {
    return request(
      `/api/customers/${encodeURIComponent(
        username
      )}/accounts/${accountType}/withdraw`,
      {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
        }),
      }
    );
  },

  transferOwnAccounts(
    username,
    fromAccountType,
    amount
  ) {
    return request(
      `/api/customers/${encodeURIComponent(
        username
      )}/transfer`,
      {
        method: "POST",
        body: JSON.stringify({
          fromAccountType,
          amount: Number(amount),
        }),
      }
    );
  },

  transferToCustomer(
    username,
    fromAccountType,
    destinationAccountId,
    amount
  ) {
    return request(
      `/api/customers/${encodeURIComponent(
        username
      )}/transfer-to-customer`,
      {
        method: "POST",
        body: JSON.stringify({
          fromAccountType,
          destinationAccountId:
            Number(destinationAccountId),
          amount: Number(amount),
        }),
      }
    );
  },

  getTransactions(username) {
    return request(
      `/api/customers/${encodeURIComponent(
        username
      )}/transactions`
    );
  },

  getAdminCustomerTransactions(username) {
    return request(
      `/api/admin/customers/${encodeURIComponent(
        username
      )}/transactions`
    );
  },

  submitContactMessage(fullName, email, message) {
    return request("/api/contact-messages", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        message,
      }),
    });
  },

  getContactMessages() {
    return request("/api/admin/contact-messages");
  },

  deleteContactMessage(messageId) {
    return request(
      `/api/admin/contact-messages/${encodeURIComponent(messageId)}`,
      {
        method: "DELETE",
      }
    );
  },

  createUserAsAdmin(
    username,
    password,
    userType
  ) {
    return request("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        userType,
      }),
    });
  },

  deleteCustomer(username) {
    return request(
      `/api/customers/${encodeURIComponent(username)}`,
      {
        method: "DELETE",
      }
    );
  },
};

export default DataService;