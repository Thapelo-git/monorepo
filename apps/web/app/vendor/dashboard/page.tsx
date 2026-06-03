"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function VendorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setTasks([
      {
        id: "1",
        wedding: "John & Sarah Wedding",
        title: "Finalize catering menu",
        description: "Review and confirm the 3-course menu",
        dueDate: "2026-05-14",
        priority: "high",
        status: "inprogress",
      },
      {
        id: "2",
        wedding: "John & Sarah Wedding",
        title: "Submit final headcount",
        description: "Confirm number of guests for catering",
        dueDate: "2026-05-20",
        priority: "high",
        status: "todo",
      },
      {
        id: "3",
        wedding: "John & Sarah Wedding",
        title: "Dietary requirements list",
        description: "Provide list of dietary requirements",
        dueDate: "2026-05-25",
        priority: "medium",
        status: "todo",
      },
    ]);
  }, []);

  if (!user) return null;

  const stats = {
    activeWeddings: 1,
    pendingTasks: tasks.filter((t) => t.status !== "completed").length,
    totalInvoices: 1,
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Vendor Dashboard</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage your tasks and invoices</p>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="text-2xl mb-2">💍</div>
              <p className="text-sm text-gray-600 mb-2">Active Weddings</p>
              <p className="text-3xl font-semibold text-[#1B2B4B]">{stats.activeWeddings}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-sm text-gray-600 mb-2">Pending Tasks</p>
              <p className="text-3xl font-semibold text-orange-700">{stats.pendingTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm text-gray-600 mb-2">Invoices</p>
              <p className="text-3xl font-semibold text-green-700">{stats.totalInvoices}</p>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-serif text-xl text-gray-900">Your Tasks</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.wedding}</p>
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-4 ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "inprogress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
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
