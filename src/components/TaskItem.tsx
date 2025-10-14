"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Task } from "../utils/utils";

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggle }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  const handleDeleteClick = () => {
    if (isConfirming) {
      onDelete(task.id);
    } else {
      setIsConfirming(true);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the component
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <li ref={itemRef} className="flex items-center gap-3 py-2 px-2 group rounded-lg transition-colors hover:bg-gray-700/70 relative">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label="toggle task"
        className={`w-4 h-4 rounded-full border transition-all ${
          task.completed 
            ? "border-green-500 bg-green-500" 
            : "border-gray-600 hover:border-sky-400"
        }`}
      >
        {task.completed && (
          <svg 
            className="w-2 h-2 mx-auto text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )}
      </button>

      {/* Task title */}
      <span
        onClick={() => onToggle(task.id)}
        className={`flex-grow cursor-pointer transition-all ${
          task.completed 
            ? "text-gray-500 line-through" 
            : "text-gray-200"
        }`}
      >
        {task.title}
      </span>

      {/* Delete button */}
      <button
        onClick={handleDeleteClick}
        className={`text-gray-500 hover:text-sky-500 transition-all ${isConfirming ? 'text-red-500' : ''}`}
        aria-label="delete"
      >
        {isConfirming ? (
          <div className={`bg-red-500 text-white p-1 rounded transition-transform transform ${isConfirming ? 'translate-x-0' : '-translate-x-full'} w-24 delete-button`}>
            Delete
          </div>
        ) : (
          <svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        )}
      </button>
    </li>
  );
};
