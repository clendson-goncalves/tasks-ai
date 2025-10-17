"use client";

import { Webhook } from "lucide-react";

import React, { useState, useEffect } from "react";
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
import {
  insertTask,
  updateTask,
  deleteTask as supabaseDelete,
  fetchTasks,
} from "../utils/supabase";
import WebhookModal from "./WebhookModal";

interface TaskManagerProps {
  date: number;
  month: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ date, month }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      if (Array.isArray(data)) {
        setTasks(
          data.map((row: any) => ({
            id: row.id,
            title: row.title,
            completed: !!row.completed,
            notes: row.notes || undefined,
          }))
        );
      }
    } catch (err) {
      console.debug("Failed to load tasks from Supabase", err);
    }
  };

  // Initial load
  useEffect(() => {
    loadTasks();
  }, []);

  // Periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      loadTasks();
    }, 1000); // Refresh every 1 second

    return () => clearInterval(interval);
  }, []);

  const handleSaveNotes = (id: number, notes: string) => {
    // Get the task's original index to maintain order
    const taskIndex = tasks.findIndex((t) => t.id === id);

    updateTask(id, { notes })
      .catch((e) => console.debug("Supabase update notes failed", e))
      .finally(() => {
        // Update while preserving original array order
        setTasks((prev) => {
          const newTasks = [...prev];
          if (taskIndex !== -1) {
            newTasks[taskIndex] = { ...newTasks[taskIndex], notes };
          }
          return newTasks;
        });

        const task = tasks.find((t) => t.id === id);
        if (task) sendWebhookEvent("task_notes_updated", { ...task, notes });
      });
  };

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: generateUniqueId(),
      title,
      completed: false,
    };
    insertTask(newTask)
      .catch((e) => console.debug("Supabase insert failed", e))
      .finally(() => {
        setTasks((prev) => [...prev, newTask]);
        sendWebhookEvent("task_created", newTask);
      });
  };

  const handleDeleteTask = (id: number) => {
    supabaseDelete(id)
      .catch((e) => console.debug("Supabase delete failed", e))
      .finally(() => {
        const deleted = tasks.find((t) => t.id === id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
        if (deleted) sendWebhookEvent("task_deleted", deleted);
      });
  };

  const handleToggleTask = (id: number) => {
    // Get the task's original index to maintain order
    const taskIndex = tasks.findIndex((t) => t.id === id);
    const task = taskIndex !== -1 ? tasks[taskIndex] : undefined;

    if (!task) return; // Task not found

    const newCompletedState = !task.completed;

    updateTask(id, { completed: newCompletedState })
      .catch((e) => console.debug("Supabase update failed", e))
      .finally(() => {
        // Update while preserving original array order
        setTasks((prev) => {
          const newTasks = [...prev];
          if (taskIndex !== -1) {
            newTasks[taskIndex] = {
              ...newTasks[taskIndex],
              completed: newCompletedState,
            };
          }
          return newTasks;
        });

        if (task)
          sendWebhookEvent("task_updated", {
            ...task,
            completed: newCompletedState,
          });
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
