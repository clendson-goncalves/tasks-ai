import React from "react";
import { TaskManager } from "@/components/TaskManager";

function App() {
  const today = new Date();
  const date = today.getDate();
  const month = today.toLocaleString("default", { month: "long" });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-500 p-8 pb-16 relative">
        <div className="max-w-md mx-auto">
          <div className="px-6">
            <h1 className="text-2xl font-medium text-white">Task Manager</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto -mt-8 relative z-10 px-4">
        <div className="bg-gray-900 rounded-xl shadow-xl">
          <TaskManager date={date} month={month} />
        </div>
      </div>
    </div>
  );
}

export default App;
