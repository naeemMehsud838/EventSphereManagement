// src/api.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (method, path, body = null) => {
  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (body && !(body instanceof FormData)) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    options.body = body;
  }

  const res  = await fetch(`${BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ─── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register : (body) => request("POST", "/auth/register", body),
  login    : (body) => request("POST", "/auth/login",    body),
  logout   : ()     => request("POST", "/auth/logout"),
  getMe    : ()     => request("GET",  "/auth/me"),
};

// ─── Users ─────────────────────────────────────────────────────
export const userAPI = {
  getAll         : (role, status) => {
    const params = new URLSearchParams();
    if (role)   params.append("role",   role);
    if (status) params.append("status", status);
    const q = params.toString();
    return request("GET", `/users${q ? `?${q}` : ""}`);
  },
  getById        : (id)     => request("GET",    `/users/${id}`),
  updateProfile  : (body)   => request("PUT",    "/users/profile/update",  body),
  changePassword : (body)   => request("PUT",    "/users/profile/password", body),
  updateStatus   : (id, status) => request("PATCH", `/users/${id}/status`, { status }),
  delete         : (id)     => request("DELETE", `/users/${id}`),
  getAdminContact: ()       => request("GET",    "/users/admin/contact"),
};

// ─── Events ────────────────────────────────────────────────────
export const eventAPI = {
  getAll    : (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/events${q ? `?${q}` : ""}`);
  },
  getById   : (id)       => request("GET",    `/events/${id}`),
  create    : (body)     => request("POST",   "/events",      body),
  update    : (id, body) => request("PUT",    `/events/${id}`, body),
  delete    : (id)       => request("DELETE", `/events/${id}`),
  adminStats: ()         => request("GET",    "/events/admin/stats"),
};

// ─── Booths ────────────────────────────────────────────────────
export const boothAPI = {
  getAll       : (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/booths${q ? `?${q}` : ""}`);
  },
  getById      : (id)       => request("GET",    `/booths/${id}`),
  getMyBooths  : ()         => request("GET",    "/booths/my/booths"),
  create       : (body)     => request("POST",   "/booths",            body),
  update       : (id, body) => request("PUT",    `/booths/${id}`,      body),
  delete       : (id)       => request("DELETE", `/booths/${id}`),
  updateStatus : (id, status) => request("PATCH", `/booths/${id}/status`, { status }),
};

// ─── Bookings ──────────────────────────────────────────────────
export const bookingAPI = {
  create       : (body)     => request("POST",  "/bookings",               body),
  getMy        : ()         => request("GET",   "/bookings/my"),
  getAll       : ()         => request("GET",   "/bookings"),
  updateStatus : (id, status) => request("PATCH", `/bookings/${id}/status`, { status }),
  cancel       : (id)       => request("PATCH", `/bookings/${id}/cancel`),
};

// ─── Tickets ───────────────────────────────────────────────────
export const ticketAPI = {
  create       : (body)     => request("POST",  "/tickets",              body),
  getMy        : ()         => request("GET",   "/tickets/my"),
  getAll       : (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/tickets${q ? `?${q}` : ""}`);
  },
  updateStatus : (id, status) => request("PATCH", `/tickets/${id}/status`, { status }),
  delete       : (id)       => request("DELETE", `/tickets/${id}`),
};

// ─── Messages ──────────────────────────────────────────────────
export const messageAPI = {
  send            : (body)   => request("POST", "/messages",                     body),
  getInbox        : ()       => request("GET",  "/messages/inbox"),
  getConversation : (userId) => request("GET",  `/messages/conversation/${userId}`),
  getAll          : ()       => request("GET",  "/messages/all"),
};

// ─── Schedule ──────────────────────────────────────────────────
export const scheduleAPI = {
  getAll  : (date)      => request("GET",    `/schedule${date ? `?date=${date}` : ""}`),
  create  : (body)      => request("POST",   "/schedule",       body),
  update  : (id, body)  => request("PUT",    `/schedule/${id}`, body),
  delete  : (id)        => request("DELETE", `/schedule/${id}`),
};

// ─── Contact ───────────────────────────────────────────────────
export const contactAPI = {
  submit   : (body) => request("POST",   "/contact",        body),
  getAll   : ()     => request("GET",    "/contact"),
  markRead : (id)   => request("PATCH",  `/contact/${id}/read`),
  delete   : (id)   => request("DELETE", `/contact/${id}`),
};