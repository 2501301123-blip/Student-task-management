// Auth helper for Client Components. The token is stored in BOTH localStorage
// (used by lib/api.js for client-initiated create/update/delete calls) AND a
// plain (non-httpOnly) cookie — the cookie is what lets Server Component pages
// (which have no access to localStorage) read the token via next/headers and
// fetch each user's own data instead of a shared dataset. See lib/api-server.js.

const TOKEN_KEY = "studyflow_token";
const USER_KEY = "studyflow_user";
const COOKIE_NAME = "studyflow_token";
const COOKIE_MAX_AGE_DAYS = 30;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function setCookie(name, value, days) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
  setCookie(COOKIE_NAME, data.token, COOKIE_MAX_AGE_DAYS);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearCookie(COOKIE_NAME);
}

export function isLoggedIn() {
  return !!getToken();
}

async function authRequest(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Authentication failed");
  return data;
}

export const login = (email, password) => authRequest("/auth/login", { email, password });
export const register = (name, email, password) => authRequest("/auth/register", { name, email, password });
