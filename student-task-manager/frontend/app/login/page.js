"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { login, register, saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "demo@studyflow.edu", password: "password123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await login(form.email, form.password)
          : await register(form.name, form.email, form.password);
      saveSession(data);
      router.push("/overview");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="card w-full max-w-sm p-8 animate-fade-in">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="font-semibold leading-tight text-gray-900 dark:text-slate-100">StudyFlow</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 leading-tight">Task Manager</p>
          </div>
        </div>

        <h1 className="text-lg font-semibold text-center text-gray-800 dark:text-slate-100 mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 text-center mb-6">
          {mode === "login" ? "Log in to access your dashboard" : "Sign up to start tracking your work"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-shadow"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-shadow"
              placeholder="you@studyflow.edu"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-base font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 dark:text-slate-500 mt-5">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>

        {mode === "login" && (
          <p className="text-xs text-center text-gray-300 dark:text-slate-600 mt-3">
            Demo account pre-filled — just hit Log In. A second account (demo2@studyflow.edu / password123)
            is also seeded, with its own separate data, to test that different users see different data.
            Run <code>npm run seed</code> in the backend first.
          </p>
        )}
      </div>
    </div>
  );
}
