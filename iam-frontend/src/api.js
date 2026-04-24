const BASE_URL = "http://localhost:5000/api";

// =========================
// HELPER (WITH ERROR HANDLING)
// =========================
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (err) {
    return { error: err.message };
  }
};

// =========================
// AUTH
// =========================
export const registerUser = (data) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = (data) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// =========================
// THREATS
// =========================
export const getThreats = () => {
  return request("/threats");
};

// =========================
// ADMIN (NEW)
// =========================
export const getUsers = () => {
  return request("/admin/users");
};

export const unlockUser = (userId) => {
  return request("/admin/unlock", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
};

// =========================
// OPTIONAL (TOKEN SUPPORT)
// =========================
export const getToken = () => localStorage.getItem("token");

export const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});