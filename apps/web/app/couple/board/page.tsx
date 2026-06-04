"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CoupleBoard() {
  const [user, setUser] = useState<any>(null);
  const [wedding, setWedding] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "medium" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setWedding({
      id: "1",
      name: "John & Sarah Wedding",
      date: "2026-06-15",
      venue: "Garden Palace, Sandton",
      budget: 250000,
      spent: 43000,
    });

    setTasks([
      { id: "1", title: "Book venue", description: "Confirm booking", status: "completed", priority: "high", dueDate: "2026-04-15", assignedTo: "Planner" },
      { id: "2", title: "Finalize menu", description: "Review menu", status: "inprogress", priority: "high", dueDate: "2026-05-14", assignedTo: "You" },
      { id: "3", title: "Flowers", description: "Choose arrangements", status: "todo", priority: "medium", dueDate: "2026-05-20", assignedTo: "You" },
      { id: "4", title: "Send invites", description: "Post invitations", status: "waiting", priority: "high", dueDate: "2026-05-21", assignedTo: "Planner" },
    ]);
  }, []);

  if (!user || !wedding) return null;

  const columns = [
    { id: "todo", label: "To Do", color: "#b8976a" },
    { id: "inprogress", label: "In Progress", color: "#1B2B4B" },
    { id: "waiting", label: "Waiting", color: "#6b6b4a" },
    { id: "completed", label: "Completed", color: "#4a8b6b" },
  ];

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  const handleDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (!draggedTask) return;
    setTasks(
      tasks.map((t) =>
        t.id === draggedTask.id ? { ...t, status } : t
      )
    );
    setDraggedTask(null);
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: "todo",
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        assignedTo: "You",
      },
    ]);
    setNewTask({ title: "", description: "", dueDate: "", priority: "medium" });
    setShowAddTask(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">{wedding.name}</h1>
            <p className="text-xs text-gray-400 -mt-0.5">{wedding.venue}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl mb-2">Wedding Date: {wedding.date}</h2>
                <p className="text-white/80">Days until wedding: 12</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Budget Spent</p>
                <p className="text-3xl font-semibold">R{wedding.spent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg"
            >
              + Add Task
            </button>
          </div>

          {showAddTask && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 px-4 py-2 bg-[#1B2B4B] text-white rounded-lg font-medium"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((col) => (
              <div key={col.id} className="w-80 flex-shrink-0">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 text-sm">
                    {col.label} ({getTasksByStatus(col.id).length})
                  </h3>
                </div>
                <div
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(col.id)}
                  className="min-h-96 bg-gray-50 rounded-lg p-3 space-y-3"
                >
                  {getTasksByStatus(col.id).map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white rounded-lg p-3 cursor-move hover:shadow-md border-l-4"
                      style={{ borderLeftColor: col.color }}
                    >
                      <p className="font-medium text-sm text-gray-800 mb-1">{task.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                      <div className="flex justify-between">
                        <span
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{
                            background:
                              task.priority === "high"
                                ? "#fee2e2"
                                : task.priority === "medium"
                                ? "#fef3c7"
                                : "#f0fdf4",
                            color:
                              task.priority === "high"
                                ? "#991b1b"
                                : task.priority === "medium"
                                ? "#92400e"
                                : "#166534",
                          }}
                        >
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedTask(null)}>
          <div className="bg-white w-full max-w-sm rounded-t-2xl p-6 slide-in-right">
            <h3 className="font-serif text-2xl text-gray-900 mb-4">{selectedTask.title}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600">Description</label>
                <p className="text-sm text-gray-700 mt-1">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Due Date</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Priority</label>
                  <p className="text-sm text-gray-700 mt-1 capitalize">{selectedTask.priority}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-full px-4 py-2 bg-[#1B2B4B] text-white rounded-lg font-medium mt-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
