"use client";

import React, { useState } from "react";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ProgressBar } from './ProgressBar';
import TaskForm from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { TaskItem } from './TaskItem';
import { filterTasksByStatus, Task, generateUniqueId } from "../utils/utils";

interface TaskManagerProps {
  date: number;
  month: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ date, month }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const handleSaveNotes = (id: number, notes: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, notes } : t));
  };

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: generateUniqueId(),
      title,
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => 
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = filterTasksByStatus(tasks, filter);
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="p-6">
      <h2 className="text-xl font-medium text-white mb-4">{date} {month}</h2>
      
      <ProgressBar total={tasks.length} completed={completedTasks} />
      <TaskForm onAddTask={handleAddTask} />
      <TaskFilters currentFilter={filter} onFilterChange={setFilter} />

      {filteredTasks.length > 0 ? (
        <ul className="">
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
        <p className="text-center text-gray-500 mt-4">
          No tasks to display.
        </p>
      )}
    </div>
  );
};
