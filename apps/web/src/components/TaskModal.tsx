"use client";
import { useState, useEffect, useRef } from "react";

interface TaskValues {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: TaskValues) => Promise<void>;
  initial?: TaskValues;
  mode?: "create" | "edit";
}

const PRIORITIES = [
  { value: "low",    label: "Low",    ring: "focus:ring-emerald-400", active: "bg-emerald-500 text-white border-emerald-500", rest: "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-400" },
  { value: "medium", label: "Medium", ring: "focus:ring-amber-400",   active: "bg-amber-500 text-white border-amber-500",     rest: "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600 dark:border-gray-600 dark:text-gray-400" },
  { value: "high",   label: "High",   ring: "focus:ring-rose-400",    active: "bg-rose-500 text-white border-rose-500",       rest: "border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-600 dark:border-gray-600 dark:text-gray-400" },
];

const EMPTY: TaskValues = { title: "", description: "", dueDate: "", priority: "medium" };

export default function TaskModal({ open, onClose, onSave, initial, mode = "create" }: TaskModalProps) {
  const [values, setValues] = useState<TaskValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValues(initial ?? EMPTY);
      setError("");
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const set = (k: keyof TaskValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(values);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    }
    setSaving(false);
  }

  if (!open) return null;

  const barColor = values.priority === "high" ? "bg-rose-400" : values.priority === "medium" ? "bg-amber-400" : "bg-emerald-400";
  const barWidth = values.priority === "high" ? "w-full" : values.priority === "medium" ? "w-2/3" : "w-1/3";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.18s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="font-serif text-2xl text-gray-900 dark:text-white">
              {mode === "edit" ? "Edit Task" : "New Task"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "edit" ? "Update task details" : "Add a task to the board"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-6" />

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                ref={titleRef}
                type="text"
                required
                value={values.title}
                onChange={set("title")}
                placeholder="e.g. Book the florist"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/25 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Description <span className="text-gray-300 dark:text-gray-500 font-normal normal-case">(optional)</span>
              </label>
              <textarea
                value={values.description}
                onChange={set("description")}
                placeholder="Add any notes or details…"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/25 transition resize-none"
              />
            </div>

            {/* Due date + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Due Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={values.dueDate}
                  onChange={set("dueDate")}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/25 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Priority
                </label>
                <div className="flex gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setValues((v) => ({ ...v, priority: p.value }))}
                      className={`flex-1 py-3 rounded-xl text-xs font-semibold border transition-all ${
                        values.priority === p.value ? p.active : p.rest
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority bar */}
            <div className="h-1 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              <div className={`h-full rounded-full transition-all duration-300 ${barColor} ${barWidth}`} />
            </div>

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] hover:shadow-lg hover:shadow-[#1B2B4B]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {mode === "edit" ? "Saving…" : "Adding…"}
                </span>
              ) : mode === "edit" ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.95) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
