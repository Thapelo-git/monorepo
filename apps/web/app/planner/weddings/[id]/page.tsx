"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

const MOCK_WEDDINGS = {
  "1": { id: "1", name: "John and Sarah Wedding", date: "2026-06-15", venue: "Garden Palace, Sandton", budget: 250000, spent: 43000, tasks: [{ id: "1", title: "Book venue", description: "Confirm booking", status: "completed", priority: "high", dueDate: "2026-04-15" }, { id: "2", title: "Finalize menu", description: "Review menu", status: "inprogress", priority: "high", dueDate: "2026-05-14" }, { id: "3", title: "Flowers", description: "Choose arrangements", status: "todo", priority: "medium", dueDate: "2026-05-20" }] },
  "2": { id: "2", name: "Mike and Anna Wedding", date: "2026-07-20", venue: "Vineyard Estate", budget: 180000, spent: 12000, tasks: [{ id: "5", title: "Venue walkthrough", status: "completed", priority: "high", dueDate: "2026-05-08" }] }
};

export default function Page() {
  const params = useParams();
  const weddingId = params.id;
  const [wedding, setWedding] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const data = MOCK_WEDDINGS[weddingId];
    if (data) {
      setWedding(data);
      setTasks(data.tasks);
    }
  }, [weddingId]);

  if (!wedding) return <div className="flex"><Sidebar /><main className="ml-64 flex-1 p-6">Loading...</main></div>;

  const columns = [{ id: "todo", label: "To Do", color: "#b8976a" }, { id: "inprogress", label: "In Progress", color: "#1B2B4B" }, { id: "waiting", label: "Waiting", color: "#6b6b4a" }, { id: "completed", label: "Completed", color: "#4a8b6b" }];
  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const handleDrop = (status) => {
    if (!draggedTask) return;
    setTasks(tasks.map((t) => t.id === draggedTask.id ? { ...t, status } : t));
    setDraggedTask(null);
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
        </div>
        <div className="p-6">
          <div className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-xl p-6 mb-6">
            <h2 className="font-serif text-2xl mb-2">Wedding: {wedding.date}</h2>
            <p className="text-white/80">Budget: R{wedding.spent.toLocaleString()} / R{wedding.budget.toLocaleString()}</p>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((col) => (
              <div key={col.id} className="w-80 flex-shrink-0">
                <h3 className="font-semibold text-gray-700 text-sm mb-4">{col.label} ({getTasksByStatus(col.id).length})</h3>
                <div onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(col.id)} className="min-h-96 bg-gray-50 rounded-lg p-3 space-y-3">
                  {getTasksByStatus(col.id).map((task) => (
                    <div key={task.id} draggable onDragStart={() => setDraggedTask(task)} onClick={() => setSelectedTask(task)} className="bg-white rounded-lg p-3 cursor-move hover:shadow-md border-l-4" style={{ borderLeftColor: col.color }}>
                      <p className="font-medium text-sm text-gray-800 mb-1">{task.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                      <div className="flex justify-between">
                        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: task.priority === "high" ? "#fee2e2" : "#fef3c7", color: task.priority === "high" ? "#991b1b" : "#92400e" }}>{task.priority}</span>
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
          <div className="bg-white w-full max-w-sm rounded-t-2xl p-6">
            <h3 className="font-serif text-2xl text-gray-900 mb-4">{selectedTask.title}</h3>
            <p className="text-sm text-gray-700 mb-4">{selectedTask.description}</p>
            <button onClick={() => setSelectedTask(null)} className="w-full px-4 py-2 bg-[#1B2B4B] text-white rounded-lg font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}