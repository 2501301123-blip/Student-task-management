"use client";

import { useEffect, useState } from "react";
import { getStoredTheme, setTheme as persistTheme } from "@/lib/theme";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "Student User", email: "student@studyflow.edu" });
  const [prefs, setPrefs] = useState({ emailNotifications: true, taskReminders: true });
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDarkMode(getStoredTheme() === "dark");
  }, []);

  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked);
    persistTheme(checked ? "dark" : "light");
  };

  const handleSave = (e) => {
    e.preventDefault();
    // In a full build this would PUT to /api/users/:id — kept local for now
    // since profile editing isn't wired to the backend yet (see README).
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100">Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Full Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Email</label>
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
            />
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 dark:text-slate-100 pt-2">Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300">
            Dark mode
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => handleDarkModeToggle(e.target.checked)}
              className="w-4 h-4 accent-brand-600"
            />
          </label>
          {[
            { key: "emailNotifications", label: "Email notifications" },
            { key: "taskReminders", label: "Task due-date reminders" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300">
              {label}
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
                className="w-4 h-4 accent-brand-600"
              />
            </label>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white">
            Save Changes
          </button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">Saved!</span>}
        </div>
      </form>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">About</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          StudyFlow — Student Task Management System. Built with Next.js App Router, Node.js/Express REST API, and MongoDB.
        </p>
      </div>
    </div>
  );
}
