"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { logout } from "@/lib/auth";

// Catches errors from Server Component data fetches in this route group —
// most commonly an expired or invalid token (the middleware only checks that
// a token cookie exists, not that it's still valid, since verifying a JWT
// signature isn't available in the Edge runtime without extra dependencies).
export default function DashboardError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleReLogin = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card card-static max-w-sm w-full p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} />
        </div>
        <h2 className="font-semibold text-gray-800 dark:text-slate-100 mb-1">Session expired</h2>
        <p className="text-sm text-gray-400 dark:text-slate-500 mb-5">
          Your login session couldn't be verified. Please log in again to continue.
        </p>
        <button
          onClick={handleReLogin}
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
        >
          Log In Again
        </button>
      </div>
    </div>
  );
}
