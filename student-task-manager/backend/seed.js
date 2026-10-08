require("dotenv").config();
const connectDB = require("./config/db");
const Task = require("./models/Task");
const Project = require("./models/Project");
const TeamMember = require("./models/TeamMember");
const Event = require("./models/Event");
const Document = require("./models/Document");
const Message = require("./models/Message");
const User = require("./models/User");

const DAY = 86400000;

// Seeds a complete, isolated workspace (team, projects, tasks, events,
// documents, messages) for a single user. Called once per demo account.
async function seedWorkspaceFor(user, data) {
  const team = await TeamMember.insertMany(
    data.team.map((t) => ({ ...t, user: user._id }))
  );

  const projects = await Project.insertMany(
    data.projects.map((p) => ({
      ...p,
      user: user._id,
      members: p.memberIdx.map((i) => team[i]._id),
      memberIdx: undefined,
    }))
  );

  await Task.insertMany(
    data.tasks.map((t) => ({
      ...t,
      user: user._id,
      project: projects[t.projectIdx]._id,
      assignee: team[t.assigneeIdx]._id,
      projectIdx: undefined,
      assigneeIdx: undefined,
    }))
  );

  await Event.insertMany(
    data.events.map((e) => ({
      ...e,
      user: user._id,
      project: e.projectIdx != null ? projects[e.projectIdx]._id : null,
      projectIdx: undefined,
    }))
  );

  await Document.insertMany(
    data.documents.map((d) => ({
      ...d,
      user: user._id,
      project: projects[d.projectIdx]._id,
      uploadedBy: team[d.uploadedByIdx]._id,
      projectIdx: undefined,
      uploadedByIdx: undefined,
    }))
  );

  await Message.insertMany(
    data.messages.map((m) => ({
      ...m,
      user: user._id,
      sender: team[m.senderIdx]._id,
      senderIdx: undefined,
    }))
  );
}

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    Task.deleteMany(),
    Project.deleteMany(),
    TeamMember.deleteMany(),
    Event.deleteMany(),
    Document.deleteMany(),
    Message.deleteMany(),
    User.deleteMany(),
  ]);

  console.log("Seeding demo login accounts...");
  const userA = await User.create({
    name: "Demo Student",
    email: "demo@studyflow.edu",
    password: "password123",
  });
  const userB = await User.create({
    name: "Second Student",
    email: "demo2@studyflow.edu",
    password: "password123",
  });

  console.log("Seeding workspace for demo@studyflow.edu...");
  await seedWorkspaceFor(userA, {
    team: [
      { name: "Aarav Sharma", email: "aarav@student.edu", role: "Team Lead", avatarColor: "#6366f1", status: "online" },
      { name: "Priya Verma", email: "priya@student.edu", role: "Frontend Developer", avatarColor: "#ec4899", status: "online" },
      { name: "Rohan Mehta", email: "rohan@student.edu", role: "UI/UX Designer", avatarColor: "#22c55e", status: "away" },
      { name: "Sneha Iyer", email: "sneha@student.edu", role: "Researcher", avatarColor: "#f59e0b", status: "offline" },
      { name: "Karthik Rao", email: "karthik@student.edu", role: "Backend Developer", avatarColor: "#0ea5e9", status: "online" },
      { name: "Ananya Das", email: "ananya@student.edu", role: "QA / Tester", avatarColor: "#a855f7", status: "away" },
    ],
    projects: [
      { name: "Final Year Capstone", description: "Student Task Management System build — full stack Next.js + Node app", status: "active", color: "#6366f1", deadline: new Date(Date.now() + 20 * DAY), progress: 55, memberIdx: [0, 1, 4] },
      { name: "Database Systems Assignment", description: "ER diagrams, normalization report, and SQL query set", status: "active", color: "#22c55e", deadline: new Date(Date.now() + 5 * DAY), progress: 70, memberIdx: [2] },
      { name: "Research Paper - AI Ethics", description: "Literature review and draft submission for the ethics seminar", status: "on-hold", color: "#f59e0b", deadline: new Date(Date.now() + 30 * DAY), progress: 20, memberIdx: [3] },
      { name: "Mobile Study Planner App", description: "Side project — React Native app for exam revision scheduling", status: "active", color: "#0ea5e9", deadline: new Date(Date.now() + 40 * DAY), progress: 10, memberIdx: [1, 4] },
      { name: "Hackathon Prep", description: "48-hour campus hackathon — building a sustainability tracker", status: "completed", color: "#a855f7", deadline: new Date(Date.now() - 10 * DAY), progress: 100, memberIdx: [0, 2, 5] },
      { name: "Group Study Notes Wiki", description: "Shared Notion-style wiki for semester revision notes", status: "archived", color: "#94a3b8", deadline: new Date(Date.now() - 45 * DAY), progress: 100, memberIdx: [3, 5] },
    ],
    tasks: [
      // Capstone (project 0)
      { title: "Design REST API endpoints", description: "Define routes for tasks, projects, team", status: "done", priority: "high", projectIdx: 0, assigneeIdx: 0, dueDate: new Date(Date.now() - 8 * DAY), tags: ["backend", "api"], completed: true },
      { title: "Connect MongoDB models", description: "Set up Mongoose schemas for all six collections", status: "done", priority: "medium", projectIdx: 0, assigneeIdx: 4, dueDate: new Date(Date.now() - 6 * DAY), tags: ["backend", "database"], completed: true },
      { title: "Implement JWT authentication", description: "Login, register, and protected routes", status: "done", priority: "high", projectIdx: 0, assigneeIdx: 4, dueDate: new Date(Date.now() - 3 * DAY), tags: ["backend", "auth"], completed: true },
      { title: "Build Next.js dashboard shell", description: "Sidebar, topbar, routing layout", status: "in-progress", priority: "high", projectIdx: 0, assigneeIdx: 1, dueDate: new Date(Date.now() + 2 * DAY), tags: ["frontend"] },
      { title: "Build Analytics dashboard charts", description: "Task trend chart and status/priority breakdowns", status: "in-progress", priority: "medium", projectIdx: 0, assigneeIdx: 1, dueDate: new Date(Date.now() + 4 * DAY), tags: ["frontend", "analytics"] },
      { title: "Add dark mode support", description: "Theme toggle across all dashboard pages", status: "review", priority: "medium", projectIdx: 0, assigneeIdx: 1, dueDate: new Date(Date.now() + 1 * DAY), tags: ["frontend", "ui"] },
      { title: "Fix task filter bug", description: "Filters not resetting properly when switching projects", status: "todo", priority: "urgent", projectIdx: 0, assigneeIdx: 1, dueDate: new Date(Date.now() - 1 * DAY), tags: ["bug", "frontend"] },
      { title: "Write API test cases", description: "Postman collection covering all CRUD endpoints", status: "todo", priority: "medium", projectIdx: 0, assigneeIdx: 5, dueDate: new Date(Date.now() + 6 * DAY), tags: ["testing"] },
      { title: "Prepare presentation slides", description: "Capstone demo day slides and speaker notes", status: "todo", priority: "medium", projectIdx: 0, assigneeIdx: 0, dueDate: new Date(Date.now() + 15 * DAY), tags: ["presentation"] },
      { title: "Deploy backend to Render", description: "Set up production environment variables and deploy", status: "todo", priority: "low", projectIdx: 0, assigneeIdx: 4, dueDate: new Date(Date.now() + 18 * DAY), tags: ["deployment"] },

      // Database Systems (project 1)
      { title: "Write ER diagram", description: "Entity relationships for the DB assignment", status: "review", priority: "medium", projectIdx: 1, assigneeIdx: 2, dueDate: new Date(Date.now() + 1 * DAY), tags: ["database"] },
      { title: "Normalize schema to 3NF", description: "Remove transitive dependencies from the student records table", status: "done", priority: "high", projectIdx: 1, assigneeIdx: 2, dueDate: new Date(Date.now() - 2 * DAY), tags: ["database"], completed: true },
      { title: "Write 10 sample SQL queries", description: "Joins, subqueries, and aggregate functions", status: "todo", priority: "medium", projectIdx: 1, assigneeIdx: 2, dueDate: new Date(Date.now() + 3 * DAY), tags: ["sql"] },

      // AI Ethics (project 2)
      { title: "Literature review draft", description: "Summarize 10 papers on AI ethics and bias", status: "todo", priority: "low", projectIdx: 2, assigneeIdx: 3, dueDate: new Date(Date.now() + 10 * DAY), tags: ["research"] },
      { title: "Outline argument structure", description: "Thesis statement and section breakdown", status: "in-progress", priority: "medium", projectIdx: 2, assigneeIdx: 3, dueDate: new Date(Date.now() + 5 * DAY), tags: ["research", "writing"] },

      // Mobile Study Planner (project 3)
      { title: "Sketch app wireframes", description: "Low-fidelity screens for onboarding and calendar view", status: "in-progress", priority: "medium", projectIdx: 3, assigneeIdx: 1, dueDate: new Date(Date.now() + 7 * DAY), tags: ["design"] },
      { title: "Set up React Native project", description: "Expo scaffold with navigation configured", status: "todo", priority: "low", projectIdx: 3, assigneeIdx: 4, dueDate: new Date(Date.now() + 12 * DAY), tags: ["mobile"] },

      // Hackathon (project 4, completed)
      { title: "Build sustainability tracker MVP", description: "Core carbon-footprint calculator feature", status: "done", priority: "urgent", projectIdx: 4, assigneeIdx: 0, dueDate: new Date(Date.now() - 11 * DAY), tags: ["hackathon"], completed: true },
      { title: "Submit final hackathon build", description: "Zip and submit to the judging portal", status: "done", priority: "high", projectIdx: 4, assigneeIdx: 5, dueDate: new Date(Date.now() - 10 * DAY), tags: ["hackathon"], completed: true },

      // Wiki (project 5, archived)
      { title: "Migrate old notes into new wiki structure", description: "One-time migration from shared docs", status: "done", priority: "low", projectIdx: 5, assigneeIdx: 3, dueDate: new Date(Date.now() - 46 * DAY), tags: ["docs"], completed: true },
    ],
    events: [
      { title: "Capstone Midpoint Review", date: new Date(Date.now() + 3 * DAY), type: "meeting", projectIdx: 0 },
      { title: "DB Assignment Due", date: new Date(Date.now() + 5 * DAY), type: "deadline", projectIdx: 1 },
      { title: "AI Ethics Draft Submission", date: new Date(Date.now() + 12 * DAY), type: "deadline", projectIdx: 2 },
      { title: "Mid-Sem Exam", date: new Date(Date.now() + 8 * DAY), type: "exam", projectIdx: null },
      { title: "Mentor Check-in", date: new Date(Date.now() + 1 * DAY), type: "meeting", projectIdx: 0 },
      { title: "Mobile App Design Review", date: new Date(Date.now() + 9 * DAY), type: "meeting", projectIdx: 3 },
      { title: "Capstone Final Demo Day", date: new Date(Date.now() + 20 * DAY), type: "deadline", projectIdx: 0 },
      { title: "Study Group — DBMS Revision", date: new Date(Date.now() + 2 * DAY), type: "reminder", projectIdx: 1 },
      { title: "End-Sem Exam Begins", date: new Date(Date.now() + 25 * DAY), type: "exam", projectIdx: null },
      { title: "Hackathon Results Announced", date: new Date(Date.now() - 7 * DAY), type: "reminder", projectIdx: 4 },
    ],
    documents: [
      { name: "API_Specification.pdf", type: "pdf", size: "1.2 MB", projectIdx: 0, uploadedByIdx: 0 },
      { name: "Wireframes_v2.fig", type: "design", size: "3.4 MB", projectIdx: 0, uploadedByIdx: 2 },
      { name: "Database_Schema_Diagram.png", type: "image", size: "680 KB", projectIdx: 0, uploadedByIdx: 4 },
      { name: "ER_Diagram.png", type: "image", size: "540 KB", projectIdx: 1, uploadedByIdx: 2 },
      { name: "Normalization_Report.docx", type: "doc", size: "310 KB", projectIdx: 1, uploadedByIdx: 2 },
      { name: "SQL_Query_Set.sql", type: "file", size: "18 KB", projectIdx: 1, uploadedByIdx: 2 },
      { name: "Literature_Review_Draft.docx", type: "doc", size: "220 KB", projectIdx: 2, uploadedByIdx: 3 },
      { name: "AI_Ethics_Sources.xlsx", type: "sheet", size: "95 KB", projectIdx: 2, uploadedByIdx: 3 },
      { name: "App_Wireframes.fig", type: "design", size: "2.8 MB", projectIdx: 3, uploadedByIdx: 1 },
      { name: "Hackathon_Pitch_Deck.pdf", type: "pdf", size: "4.1 MB", projectIdx: 4, uploadedByIdx: 0 },
      { name: "Semester_Notes_Archive.pdf", type: "pdf", size: "6.7 MB", projectIdx: 5, uploadedByIdx: 3 },
    ],
    messages: [
      { senderIdx: 0, text: "Backend routes are ready for review.", channel: "general" },
      { senderIdx: 1, text: "Working on the dashboard sidebar now.", channel: "general" },
      { senderIdx: 2, text: "ER diagram uploaded to documents.", channel: "general" },
      { senderIdx: 4, text: "JWT auth is fully wired up — login and register both tested.", channel: "general" },
      { senderIdx: 1, text: "Dark mode toggle is in, just polishing the animations.", channel: "general" },
      { senderIdx: 5, text: "Found a bug in the task filters, opening an issue now.", channel: "general" },
      { senderIdx: 3, text: "Literature review is about 60% done, should finish by Friday.", channel: "general" },
      { senderIdx: 0, text: "Let's do a quick sync before the midpoint review.", channel: "general" },
      { senderIdx: 2, text: "Uploaded the updated wireframes for the mobile app too.", channel: "general" },
      { senderIdx: 4, text: "Deploying the backend to Render this weekend.", channel: "general" },
    ],
  });

  console.log("Seeding workspace for demo2@studyflow.edu...");
  await seedWorkspaceFor(userB, {
    team: [
      { name: "Kabir Nair", email: "kabir@student.edu", role: "Team Lead", avatarColor: "#0ea5e9", status: "online" },
      { name: "Meera Iyer", email: "meera@student.edu", role: "Data Analyst", avatarColor: "#a855f7", status: "away" },
      { name: "Yusuf Khan", email: "yusuf@student.edu", role: "Designer", avatarColor: "#f97316", status: "online" },
      { name: "Devika Pillai", email: "devika@student.edu", role: "Content Writer", avatarColor: "#22c55e", status: "offline" },
    ],
    projects: [
      { name: "Marketing Analytics Dashboard", description: "Campaign performance tracker for the college fest", status: "active", color: "#0ea5e9", deadline: new Date(Date.now() + 10 * DAY), progress: 40, memberIdx: [0, 1] },
      { name: "Mobile App Prototype", description: "Figma prototype for a campus events app", status: "active", color: "#a855f7", deadline: new Date(Date.now() + 25 * DAY), progress: 15, memberIdx: [2] },
      { name: "Fest Sponsorship Deck", description: "Pitch deck and outreach plan for sponsors", status: "active", color: "#f97316", deadline: new Date(Date.now() + 6 * DAY), progress: 60, memberIdx: [0, 3] },
      { name: "Alumni Newsletter Revamp", description: "Quarterly newsletter redesign and content calendar", status: "on-hold", color: "#22c55e", deadline: new Date(Date.now() + 35 * DAY), progress: 5, memberIdx: [3] },
    ],
    tasks: [
      { title: "Collect campaign click-through data", description: "Pull data from the three social channels", status: "in-progress", priority: "high", projectIdx: 0, assigneeIdx: 1, dueDate: new Date(Date.now() + 3 * DAY), tags: ["data"] },
      { title: "Build weekly KPI chart", description: "Visualize reach, clicks, and conversions", status: "todo", priority: "medium", projectIdx: 0, assigneeIdx: 1, dueDate: new Date(Date.now() + 6 * DAY), tags: ["analytics"] },
      { title: "Set up shared spreadsheet template", description: "Standard weekly reporting template", status: "done", priority: "low", projectIdx: 0, assigneeIdx: 0, dueDate: new Date(Date.now() - 3 * DAY), tags: ["reporting"], completed: true },
      { title: "Wireframe onboarding flow", description: "Three-screen onboarding for the app prototype", status: "todo", priority: "medium", projectIdx: 1, assigneeIdx: 2, dueDate: new Date(Date.now() + 6 * DAY), tags: ["design"] },
      { title: "Pick a colour palette", description: "Align with campus branding guidelines", status: "in-progress", priority: "low", projectIdx: 1, assigneeIdx: 2, dueDate: new Date(Date.now() + 4 * DAY), tags: ["design"] },
      { title: "Draft sponsor outreach email", description: "Template for reaching out to 15 potential sponsors", status: "review", priority: "high", projectIdx: 2, assigneeIdx: 3, dueDate: new Date(Date.now() + 1 * DAY), tags: ["outreach"] },
      { title: "Finalize sponsorship tiers", description: "Bronze / Silver / Gold packages and pricing", status: "done", priority: "high", projectIdx: 2, assigneeIdx: 0, dueDate: new Date(Date.now() - 1 * DAY), tags: ["planning"], completed: true },
      { title: "Plan newsletter content calendar", description: "Topics for the next four issues", status: "todo", priority: "low", projectIdx: 3, assigneeIdx: 3, dueDate: new Date(Date.now() + 20 * DAY), tags: ["content"] },
    ],
    events: [
      { title: "Fest Committee Sync", date: new Date(Date.now() + 4 * DAY), type: "meeting", projectIdx: 0 },
      { title: "Prototype Review", date: new Date(Date.now() + 9 * DAY), type: "deadline", projectIdx: 1 },
      { title: "Sponsor Deck Deadline", date: new Date(Date.now() + 6 * DAY), type: "deadline", projectIdx: 2 },
      { title: "Design Feedback Session", date: new Date(Date.now() + 2 * DAY), type: "meeting", projectIdx: 1 },
      { title: "Newsletter Kickoff Call", date: new Date(Date.now() + 15 * DAY), type: "meeting", projectIdx: 3 },
    ],
    documents: [
      { name: "Campaign_Report_Week1.xlsx", type: "sheet", size: "310 KB", projectIdx: 0, uploadedByIdx: 0 },
      { name: "Onboarding_Wireframes.fig", type: "design", size: "2.1 MB", projectIdx: 1, uploadedByIdx: 2 },
      { name: "Sponsorship_Pitch_Deck.pdf", type: "pdf", size: "5.2 MB", projectIdx: 2, uploadedByIdx: 3 },
      { name: "Sponsor_Contact_List.xlsx", type: "sheet", size: "48 KB", projectIdx: 2, uploadedByIdx: 0 },
      { name: "Newsletter_Style_Guide.docx", type: "doc", size: "150 KB", projectIdx: 3, uploadedByIdx: 3 },
    ],
    messages: [
      { senderIdx: 0, text: "Let's sync on the campaign numbers tomorrow.", channel: "general" },
      { senderIdx: 2, text: "Wireframes are about halfway done.", channel: "general" },
      { senderIdx: 3, text: "Sponsor email draft is ready for review.", channel: "general" },
      { senderIdx: 1, text: "KPI chart will be ready by end of week.", channel: "general" },
      { senderIdx: 0, text: "Great work on finalizing the sponsorship tiers!", channel: "general" },
    ],
  });

  console.log("Seed complete!");
  console.log("Demo login 1 -> email: demo@studyflow.edu   | password: password123");
  console.log("Demo login 2 -> email: demo2@studyflow.edu  | password: password123");
  console.log("Log in with each account in a different browser (or incognito window) to confirm they see completely separate data.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
