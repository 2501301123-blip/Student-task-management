import "./globals.css";
import { themeInitScript } from "@/lib/theme";

export const metadata = {
  title: "StudyFlow - Student Task Manager",
  description: "Student Task Management System - Next.js + Node.js + MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before paint so the correct theme class is set on <html>
            immediately — prevents a flash of the wrong theme on load. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="dark:bg-slate-950 transition-colors">{children}</body>
    </html>
  );
}
