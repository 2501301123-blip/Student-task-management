const STATUS_STYLES = {
  todo: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300",
  "in-progress": "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
  review: "bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
  done: "bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400",
};

const PRIORITY_STYLES = {
  low: "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300",
  medium: "bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  high: "bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400",
  urgent: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400",
};

const STATUS_LABELS = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] || STATUS_STYLES.todo}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium}`}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
}
