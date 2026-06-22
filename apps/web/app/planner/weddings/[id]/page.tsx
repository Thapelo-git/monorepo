"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";
import TaskModal from "@/components/TaskModal";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#b8976a" },
  { id: "inprogress", label: "In Progress", color: "#1B2B4B" },
  { id: "waiting", label: "Waiting", color: "#6b6b4a" },
  { id: "completed", label: "Completed", color: "#4a8b6b" },
];

export default function WeddingBoard() {
  const params = useParams();
  const router = useRouter();
  const weddingId = Array.isArray(params?.["id"]) ? params["id"][0] : (params?.["id"] ?? "");

  const [wedding, setWedding] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) { router.push("/auth/login"); return; }

    apiFetch(`/weddings/${weddingId}`)
      .then((w: any) => {
        setWedding(w);
        setTasks(w.tasks ?? []);
      })
      .catch(() => router.push("/planner/weddings"));
  }, [weddingId]);

  async function handleDrop(status: string) {
    if (!draggedTask || draggedTask.status === status) { setDraggedTask(null); return; }
    const prev = tasks;
    setTasks(tasks.map((t: any) => t.id === draggedTask.id ? { ...t, status } : t));
    setDraggedTask(null);
    try {
      await apiFetch(`/tasks/${draggedTask.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch {
      setTasks(prev);
    }
  }

  async function handleAddTask(task: { title: string; description: string; dueDate: string; priority: string }) {
    const created = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ ...task, weddingId, status: "todo" }),
    });
    setTasks((prev) => [...prev, created]);
  }

  if (!wedding) {
    return (
      <div className="flex min-h-screen bg-[#f7f3ee]">
        <Sidebar />
        <main className="ml-64 flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-28 bg-gray-100 rounded-xl" />
            <div className="flex gap-6">
              {[1,2,3,4].map(i => <div key={i} className="w-80 h-96 bg-gray-100 rounded-lg flex-shrink-0" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const budget = parseFloat(wedding.budget ?? 0);
  const spent = parseFloat(wedding.spentAmount ?? 0);
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const completedCount = tasks.filter((t: any) => t.status === "completed").length;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">{wedding.name}</h1>
            <p className="text-xs text-gray-400 -mt-0.5">{wedding.venue}</p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#1B2B4B]/20 transition-all"
          >
            <span className="text-base leading-none">+</span> Add Task
          </button>
        </div>

        <div className="p-6">
          {/* Stats banner */}
          <div className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-2xl p-6 mb-6 flex flex-wrap gap-6 items-center">
            <div className="flex-1 min-w-40">
              <p className="text-white/60 text-xs mb-1">Wedding date</p>
              <p className="font-serif text-xl">{new Date(wedding.weddingDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="flex-1 min-w-40">
              <p className="text-white/60 text-xs mb-1">Budget used</p>
              <p className="font-serif text-xl">R{spent.toLocaleString()} <span className="text-white/60 text-sm">/ R{budget.toLocaleString()}</span></p>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full">
                <div className="h-1.5 bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="flex-1 min-w-40">
              <p className="text-white/60 text-xs mb-1">Tasks done</p>
              <p className="font-serif text-xl">{completedCount} <span className="text-white/60 text-sm">/ {tasks.length}</span></p>
            </div>
          </div>

          {/* Kanban columns */}
          <div className="flex gap-5 overflow-x-auto pb-4">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t: any) => t.status === col.id);
              return (
                <div key={col.id} className="w-72 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                    <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                  </div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(col.id)}
                    className="min-h-96 rounded-xl p-2 space-y-2 transition-colors"
                    style={{ background: colTasks.length === 0 ? "rgba(0,0,0,0.02)" : "transparent" }}
                  >
                    {colTasks.length === 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl h-24 flex items-center justify-center">
                        <p className="text-xs text-gray-300">Drop here</p>
                      </div>
                    )}
                    {colTasks.map((task: any) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTask(task)}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white rounded-xl p-4 cursor-move hover:shadow-md hover:-translate-y-0.5 border border-gray-100 border-l-4 transition-all"
                        style={{ borderLeftColor: col.color }}
                      >
                        <p className="font-medium text-sm text-gray-800 mb-1 leading-snug">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            task.priority === "high" ? "bg-rose-100 text-rose-700" :
                            task.priority === "medium" ? "bg-amber-100 text-amber-700" :
                            "bg-emerald-100 text-emerald-700"
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(task.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <TaskModal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAdd={handleAddTask}
      />

      {/* Task detail bottom sheet */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setSelectedTask(null)}>
          <div
            className="bg-white w-full max-w-lg rounded-t-2xl p-6 shadow-2xl"
            style={{ animation: "modalIn 0.18s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-serif text-2xl text-gray-900 flex-1 pr-4">{selectedTask.title}</h3>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                selectedTask.priority === "high" ? "bg-rose-100 text-rose-700" :
                selectedTask.priority === "medium" ? "bg-amber-100 text-amber-700" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                {selectedTask.priority} priority
              </span>
            </div>
            {selectedTask.description && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedTask.description}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-500 mb-6">
              <span>📅 Due {new Date(selectedTask.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="w-full py-3 bg-[#1B2B4B] text-white rounded-xl font-medium"
            >
              Close
            </button>
          </div>
          <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
      )}
    </div>
  );
}
