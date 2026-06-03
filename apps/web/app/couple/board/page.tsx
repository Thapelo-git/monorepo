"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CoupleBoard() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [wedding, setWedding] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock data
    setWedding({
      id: "1",
      name: "John & Sarah Wedding",
      date: "2026-06-15",
      venue: "Garden Palace, Sandton",
      budget: 250000,
      spent: 43000,
    });

    setTasks([
      {
        id: "1",
        title: "Book venue",
        description: "Confirm Garden Palace booking",
        status: "completed",
        priority: "high",
        dueDate: "2026-04-15",
        assignedTo: "Planner",
      },
      {
        id: "2",
        title: "Finalize catering menu",
        description: "Review and confirm the 3-course menu",
        status: "inprogress",
        priority: "high",
        dueDate: "2026-05-14",
        assignedTo: "You",
      },
      {
        id: "3",
        title: "Choose floral arrangements",
        description: "Select centerpieces and bouquet",
        status: "todo",
        priority: "medium",
        dueDate: "2026-05-20",
        assignedTo: "You",
      },
      {
        id: "4",
        title: "Send invitations",
        description: "Print and post all invitations",
        status: "waiting",
        priority: "high",
        dueDate: "2026-05-21",
        assignedTo: "Planner",
      },
    ]);
  }, []);

  if (!user || !wedding) return null;

  const columns = [
    { id: "ideas", label: "Ideas", color: "bg-purple-100" },
    { id: "todo", label: "To Do", color: "bg-yellow-100" },
    { id: "inprogress", label: "In Progress", color: "bg-blue-100" },
    { id: "waiting", label: "Waiting", color: "bg-gray-100" },
    { id: "completed", label: "Completed", color: "bg-green-100" },
  ];

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">{wedding.name}</h1>
            <p className="text-xs text-gray-400 -mt-0.5">{wedding.venue}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Wedding Info Banner */}
          <div className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl mb-2">Wedding Date: {wedding.date}</h2>
                <p className="text-white/80">Days until wedding: {Math.ceil((new Date(wedding.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Budget Spent</p>
                <p className="text-3xl font-semibold">R{wedding.spent.toLocaleString()}</p>
                <p className="text-white/60 text-xs">of R{wedding.budget.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {columns.map((col) => (
                <div key={col.id} className="w-72 flex-shrink-0">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color.split("-")[1] }}></span>
                      {col.label}
                      <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {getTasksByStatus(col.id).length}
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-3 min-h-96 bg-gray-50 rounded-lg p-3">
                    {getTasksByStatus(col.id).map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-all border-l-4 border-blue-400"
                      >
                        <p className="font-medium text-sm text-gray-800 mb-1">{task.title}</p>
                        <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
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
        </div>
      </main>
    </div>
  );
}
