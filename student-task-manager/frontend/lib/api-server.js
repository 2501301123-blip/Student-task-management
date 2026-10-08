// Server-only API helper, used exclusively by page.js Server Components for
// their initial data fetch. Server Components can't read localStorage (that
// only exists in the browser), so instead this reads the JWT from the
// request's cookies via next/headers — the cookie is set by lib/auth.js's
// saveSession() at login time, alongside the localStorage copy that
// lib/api.js (the Client Component version) uses.
//
// Do not import this file from a Client Component ("use client") — importing
// next/headers there will break the build.

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function serverRequest(path) {
  const cookieStore = cookies();
  const token = cookieStore.get("studyflow_token")?.value;

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ----- Read-only fetchers for Server Component initial page loads -----
export const getTasks = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return serverRequest(`/tasks${qs ? `?${qs}` : ""}`);
};
export const getProjects = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return serverRequest(`/projects${qs ? `?${qs}` : ""}`);
};
export const getTeam = () => serverRequest("/team");
export const getEvents = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return serverRequest(`/events${qs ? `?${qs}` : ""}`);
};
export const getDocuments = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return serverRequest(`/documents${qs ? `?${qs}` : ""}`);
};
export const getMessages = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return serverRequest(`/messages${qs ? `?${qs}` : ""}`);
};
export const getAnalyticsOverview = () => serverRequest("/analytics/overview");
export const getAnalyticsTrend = (days = 14) => serverRequest(`/analytics/trend?days=${days}`);

// Returns just the token, for pages (like the dashboard layout) that need to
// know whether a session cookie exists at all before rendering.
export function getServerToken() {
  return cookies().get("studyflow_token")?.value || null;
}
