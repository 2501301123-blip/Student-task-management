"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getEvents, createEvent } from "@/lib/api";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TYPE_COLORS = {
  deadline: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
  meeting: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
  exam: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400",
  reminder: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
};

export default function CalendarView({ initialEvents, initialMonth, initialYear }) {
  const [month, setMonth] = useState(initialMonth); // 0-indexed
  const [year, setYear] = useState(initialYear);
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", type: "reminder" });

  useEffect(() => {
    getEvents({ month: month + 1, year }).then(setEvents).catch(() => {});
  }, [month, year]);

  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const d = new Date(ev.date).getDate();
      map[d] = map[d] ? [...map[d], ev] : [ev];
    });
    return map;
  }, [events]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    const event = await createEvent(form);
    setEvents((prev) => [...prev, event]);
    setForm({ title: "", date: "", type: "reminder" });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goPrev} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">
            <ChevronLeft size={16} />
          </button>
          <h2 className="font-semibold text-gray-800 dark:text-slate-100 w-40 text-center">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button onClick={goNext} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">
            <ChevronRight size={16} />
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-7 text-xs font-medium text-gray-400 dark:text-slate-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[90px] rounded-lg border border-gray-50 dark:border-slate-800 p-1.5 ${day ? "bg-white dark:bg-slate-900" : "bg-transparent"}`}
            >
              {day && (
                <>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">{day}</p>
                  <div className="space-y-1">
                    {(eventsByDay[day] || []).slice(0, 2).map((ev) => (
                      <div
                        key={ev._id}
                        title={ev.title}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate ${TYPE_COLORS[ev.type] || TYPE_COLORS.reminder}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {(eventsByDay[day] || []).length > 2 && (
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">+{eventsByDay[day].length - 2} more</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card card-static animate-scale-in w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Add Event</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                >
                  <option value="reminder">Reminder</option>
                  <option value="deadline">Deadline</option>
                  <option value="meeting">Meeting</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
