"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Plus, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import AddTaskModal from "../tasks/AddTaskModal";
import ThemeToggle from "../ui/ThemeToggle";
import { getUser, logout } from "@/lib/auth";

const TITLES = {
  "/overview": "Overview",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/analytics": "Analytics",
  "/documents": "Documents",
  "/messages": "Messages",
  "/team": "Team",
  "/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddTask, setShowAddTask] = useState(false);
  const [user, setUser] = useState(null);
  const title = TITLES[pathname] || "Dashboard";

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-100 dark:border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1 hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="relative w-9 h-9 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">
          <Bell size={17} />
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Task
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-1">
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0) || "?"}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-slate-300 max-w-[100px] truncate">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          className="w-9 h-9 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>

      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} />}
    </header>
  );
}
