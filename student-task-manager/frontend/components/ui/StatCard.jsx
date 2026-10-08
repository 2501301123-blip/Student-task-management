export default function StatCard({ label, value, icon: Icon, accent = "brand", suffix = "" }) {
  const colors = {
    brand: "bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300",
    green: "bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400",
    red: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400",
  };
  return (
    <div className="card group p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-semibold mt-1 text-gray-800 dark:text-slate-100">
          {value}
          {suffix}
        </p>
      </div>
      {Icon && (
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${colors[accent]}`}
        >
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
