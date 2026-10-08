# StudyFlow — Student Task Management System

A full-stack student task management dashboard.

- **Backend:** Node.js, Express, REST API, MongoDB (Mongoose)
- **Frontend:** Next.js 14 (App Router), React Server + Client Components, Tailwind CSS
- **Dashboards:** Overview, Projects, Tasks, Calendar, Analytics, Documents, Messages, Team, Settings
- **Features:** Add Task, filters (status/priority/project/search), inline status updates, add project, add event, add team member, add document, team chat/messages, analytics charts

---

## 1. Folder structure

```
student-task-manager/
├── backend/          Node.js + Express REST API + MongoDB models
└── frontend/          Next.js App Router dashboard
```

---

## 2. Requirements

- Node.js 18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) OR a MongoDB Atlas connection string

If you don't have MongoDB installed locally:
- **Windows/Mac/Linux:** install from https://www.mongodb.com/try/download/community, or
- **Easiest option:** create a free cluster at https://www.mongodb.com/cloud/atlas and copy its connection string

---

## 3. Backend setup (run this first)

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your MongoDB connection string if you're not using the local default:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_task_manager
CLIENT_URL=http://localhost:3000
JWT_SECRET=change_this_to_a_long_random_string
```

**Seed the database with demo data** (recommended — populates sample tasks, projects, team members, events, documents, messages, and **two separate demo login accounts**, each with their own isolated data):

```bash
npm run seed
```

This creates two demo logins — log in as each (in a different browser or an incognito window) to see that they have completely separate data:
```
Account 1 — Email: demo@studyflow.edu   | Password: password123
Account 2 — Email: demo2@studyflow.edu  | Password: password123
```

**Start the backend API:**

```bash
npm run dev
```

The API will run at **http://localhost:5000**. Test it by opening http://localhost:5000/api/health in your browser — you should see `{"status":"ok", ...}`.

### API Endpoints (REST)

| Resource | Endpoints |
|---|---|
| Tasks | `GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/:id` (supports `?status=&priority=&project=&assignee=&search=` filters) |
| Projects | `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/:id` |
| Team | `GET/POST /api/team`, `PUT/DELETE /api/team/:id` |
| Events (Calendar) | `GET/POST /api/events`, `PUT/DELETE /api/events/:id` (supports `?month=&year=`) |
| Documents | `GET/POST /api/documents`, `DELETE /api/documents/:id` |
| Messages | `GET/POST /api/messages` |
| Analytics | `GET /api/analytics/overview`, `GET /api/analytics/trend?days=14` |

---

## 4. Frontend setup

Open a **new terminal** (keep the backend running in the other one):

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Confirm `.env.local` points to your backend:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You'll be redirected to `/overview`.

---

## 5. Running both together (quick reference)

```bash
# Terminal 1
cd backend && npm install && npm run seed && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

Then visit http://localhost:3000

---

## 6. Project architecture notes

- **Client vs Server Components:** Pages like Overview, Tasks, Projects, Calendar, Analytics, Documents, Messages, and Team are Next.js Server Components — they fetch their initial data directly from the Express API on the server for fast first paint. Interactive pieces (filters, forms, modals, status dropdowns) are Client Components (`"use client"`) that re-fetch or mutate data via `fetch` calls to the REST API, then call `router.refresh()` where relevant so server-rendered data stays in sync.
- **Data flow:** Browser → Next.js (Server or Client Component) → Express REST API (`/api/...`) → Mongoose → MongoDB, and back.
- **State management:** Local React `useState`/`useEffect` per page — no external state library needed for this scope.
- **Filters:** Implemented both client-side (instant UI updates) and server-side (Express reads query params and builds a MongoDB filter object) — see `backend/controllers/taskController.js`.
- **Add Task:** Available globally from the Topbar (any page) and directly on the Tasks page. Both use the same `AddTaskModal` component, which POSTs to `/api/tasks`.

---

## 7. Login & Authentication — Per-User Data Isolation

- Visiting the app now sends you to `/login` if you aren't logged in.
- Use a demo account (`demo@studyflow.edu` or `demo2@studyflow.edu`, both `password123`, created by `npm run seed`) or click **Sign up** to create your own.
- **Every user now sees only their own data.** All backend routes (tasks, projects, team, events, documents, messages, analytics) are protected by JWT auth middleware, and every model (`Task`, `Project`, `TeamMember`, `Event`, `Document`, `Message`) carries a `user` field. Every read is filtered by the logged-in user's ID, every create stamps that ID, and every update/delete verifies ownership before touching a record.
- **How the frontend passes the token to Server Components:** on login, `lib/auth.js` stores the JWT in both `localStorage` (used by Client Components for create/update/delete calls via `lib/api.js`) *and* a plain cookie (used by Server Components, which can't read `localStorage`, via `lib/api-server.js` and Next's `next/headers`). This is what makes each dashboard page's initial server-rendered data user-specific instead of shared.
- `middleware.js` redirects logged-out visitors to `/login` before any protected page's Server Component even tries to fetch data. `app/(dashboard)/error.js` catches the edge case of an expired/invalid token and prompts a clean re-login instead of crashing.
- Log out anytime with the button next to your name in the top-right corner.

## 8. Dark Mode

- Click the sun/moon icon in the top bar (or the toggle in Settings) to switch themes. The choice is saved to `localStorage` and restored on reload with no flash of the wrong theme (`lib/theme.js` injects a small blocking script in `app/layout.js` that applies the theme before first paint).
- Implemented with Tailwind's class-based dark mode (`darkMode: "class"` in `tailwind.config.js`) — every component uses a `dark:` variant alongside its light-mode classes.

## 9. UI polish (font size & animations)

- Base font size was bumped from the browser default (16px → 18px) in `app/globals.css`, so all of Tailwind's rem-based text sizes scale up consistently across every page.
- Cards lift gently on hover, buttons have a subtle press/lift animation, modals fade and scale in, the sidebar's active link nudges slightly, and dashboard pages fade in on load — all lightweight CSS transitions/keyframes in `app/globals.css`, no animation library needed.

## 10. Customizing

- Colors/branding: `frontend/tailwind.config.js` and `frontend/app/globals.css`
- Add authentication: add a `User` model + JWT middleware in `backend/middleware/`, protect routes, and add a login page in `frontend/app/login/page.js`
- Deploy: backend to any Node host (Render, Railway, EC2) + MongoDB Atlas; frontend to Vercel (set `NEXT_PUBLIC_API_URL` to your deployed backend URL)

---

## 11. Troubleshooting

- **"Failed to fetch" errors in the dashboard:** the backend isn't running, or `.env.local`'s `NEXT_PUBLIC_API_URL` doesn't match the backend's port.
- **MongoDB connection error:** confirm MongoDB is running (`mongod`) or that your Atlas URI/IP allowlist is correct.
- **Empty dashboard:** run `npm run seed` in the backend folder.
- **Redirected straight back to `/login` after logging in:** your browser may be blocking third-party or `SameSite` cookies (rare on `localhost`) — check DevTools → Application → Cookies for a `studyflow_token` cookie after logging in.
- **"Session expired" screen right after logging in:** the backend's `JWT_SECRET` in `.env` was likely changed or is missing — restart the backend after setting it, then log in again.
- **Seeing another account's old data after switching users:** log out fully (the button next to your name) before logging into a different account — this clears both the `localStorage` token and the cookie the Server Components read from.
