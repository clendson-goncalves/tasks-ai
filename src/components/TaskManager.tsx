"use client";

import { Webhook } from "lucide-react";

import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ProgressBar } from "./ProgressBar";
import TaskForm from "./TaskForm";
import { TaskFilters } from "./TaskFilters";
import { TaskItem } from "./TaskItem";
import {
  filterTasksByStatus,
  Task,
  generateUniqueId,
  sendWebhookEvent,
} from "../utils/utils";
import WebhookModal from "./WebhookModal";

interface TaskManagerProps {
  date: number;
  month: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ date, month }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);

  const handleSaveNotes = (id: number, notes: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, notes } : t));
      const task = updated.find((t) => t.id === id);
      if (task) sendWebhookEvent("task_notes_updated", task);
      return updated;
    });
  };

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: generateUniqueId(),
      title,
      completed: false,
    };
    setTasks((prev) => {
      const next = [...prev, newTask];
      sendWebhookEvent("task_created", newTask);
      return next;
    });
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => {
      const next = prev.filter((task) => task.id !== id);
      const deleted = prev.find((t) => t.id === id);
      if (deleted) sendWebhookEvent("task_deleted", deleted);
      return next;
    });
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      const t = updated.find((x) => x.id === id);
      if (t) sendWebhookEvent("task_updated", t);
      return updated;
    });
  };

  const filteredTasks = filterTasksByStatus(tasks, filter);
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">
          {date} {month}
        </h2>

        <button
          onClick={() => setIsWebhookOpen(true)}
          className="text-gray-400 hover:text-teal-400"
        >
          <Webhook size={20} className="text-gray-400 hover:text-teal-400" />
        </button>
      </div>

      <ProgressBar total={tasks.length} completed={completedTasks} />
      <TaskForm onAddTask={handleAddTask} />
      <TaskFilters currentFilter={filter} onFilterChange={setFilter} />

      {filteredTasks.length > 0 ? (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
              onSaveNotes={handleSaveNotes}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4">No tasks to display.</p>
      )}

      <WebhookModal
        open={isWebhookOpen}
        onClose={() => setIsWebhookOpen(false)}
      />
    </div>
  );
};
