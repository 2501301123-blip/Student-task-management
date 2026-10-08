"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  Users,
  Settings,
  GraduationCap,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight text-gray-900 dark:text-slate-100">StudyFlow</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 leading-tight">Task Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-0.5 ${
                active
                  ? "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-slate-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-slate-800">
        <div className="rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white text-xs">
          <p className="font-semibold mb-1">Need help?</p>
          <p className="opacity-90">Check the README for setup & API docs.</p>
        </div>
      </div>
    </aside>
  );
}
