// Dark mode helper for Client Components. Theme preference is stored in
// localStorage and applied as a "dark" class on <html>, which Tailwind's
// class-based dark mode strategy (darkMode: "class") picks up automatically
// via dark: variants throughout the app.

const THEME_KEY = "studyflow_theme";

export function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(THEME_KEY) || "light";
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme() {
  const next = getStoredTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

// Inline script string, injected into <head> via a <script> tag in the root
// layout so the correct theme class is applied before first paint — avoiding
// a flash of the wrong theme on reload. Falls back to the OS preference if
// the user hasn't chosen one yet.
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;
