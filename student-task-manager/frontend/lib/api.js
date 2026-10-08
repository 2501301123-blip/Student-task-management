// Central API helper used by both Server Components (SSR fetch) and
// Client Components (fetch on interaction, e.g. after creating a task).
// Works in both environments because it just uses the native fetch API.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  // Attach the logged-in user's token when running in the browser (Client Components).
  // Server Components run on the server and have no access to localStorage, so their
  // initial page-load fetches remain unauthenticated (see lib/auth.js for details).
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("studyflow_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    // no-store keeps dashboard data fresh on every navigation (Server Components)
    cache: "no-store",
    headers,
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  // DELETE requests may return an empty body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ----- Tasks -----
export const getTasks = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/tasks${qs ? `?${qs}` : ""}`);
};
export const getTask = (id) => request(`/tasks/${id}`);
export const createTask = (data) => request("/tasks", { method: "POST", body: JSON.stringify(data) });
export const updateTask = (id, data) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });

// ----- Projects -----
export const getProjects = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/projects${qs ? `?${qs}` : ""}`);
};
export const getProject = (id) => request(`/projects/${id}`);
export const createProject = (data) => request("/projects", { method: "POST", body: JSON.stringify(data) });
export const updateProject = (id, data) => request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProject = (id) => request(`/projects/${id}`, { method: "DELETE" });

// ----- Team -----
export const getTeam = () => request("/team");
export const createMember = (data) => request("/team", { method: "POST", body: JSON.stringify(data) });
export const updateMember = (id, data) => request(`/team/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteMember = (id) => request(`/team/${id}`, { method: "DELETE" });

// ----- Events / Calendar -----
export const getEvents = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/events${qs ? `?${qs}` : ""}`);
};
export const createEvent = (data) => request("/events", { method: "POST", body: JSON.stringify(data) });
export const updateEvent = (id, data) => request(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteEvent = (id) => request(`/events/${id}`, { method: "DELETE" });

// ----- Documents -----
export const getDocuments = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/documents${qs ? `?${qs}` : ""}`);
};
export const createDocument = (data) => request("/documents", { method: "POST", body: JSON.stringify(data) });
export const deleteDocument = (id) => request(`/documents/${id}`, { method: "DELETE" });

// ----- Messages -----
export const getMessages = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/messages${qs ? `?${qs}` : ""}`);
};
export const createMessage = (data) => request("/messages", { method: "POST", body: JSON.stringify(data) });

// ----- Analytics -----
export const getAnalyticsOverview = () => request("/analytics/overview");
export const getAnalyticsTrend = (days = 14) => request(`/analytics/trend?days=${days}`);
