"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getStoredTheme, toggleTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setThemeState(next);
  };

  return (
    <button
      onClick={handleToggle}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
