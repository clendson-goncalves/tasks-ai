"use client";

import { Trash2, WandSparkles, CircleCheck, Circle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Task } from "../utils/utils";

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onSaveNotes?: (id: number, notes: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onToggle,
  onSaveNotes,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li ref={itemRef} className="py-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            aria-label={
              task.completed ? "mark as incomplete" : "mark as complete"
            }
            className={`mr-2 p-1 rounded-full transition-colors focus:outline-none ${task.completed}`}
          >
            {task.completed ? (
              <CircleCheck size={18} className="text-teal-600" />
            ) : (
              <Circle size={18} className="text-gray-500" />
            )}
          </button>

          <div className="min-w-0" onClick={() => onToggle(task.id)}>
            <div
              className={`cursor-pointer transition-all ${
                task.completed ? "text-gray-500 line-through" : "text-gray-200"
              }`}
            >
              {task.title}
            </div>

            {task.notes && task.notes.trim() !== "" && (
              <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                {task.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Call onSaveNotes directly without showing notes form
              if (typeof onSaveNotes === "function") {
                setIsProcessingAI(true);
                onSaveNotes(task.id, "Processing with AI...");
                setTimeout(() => setIsProcessingAI(false), 4000); // Visual feedback
              }
            }}
            className={`text-gray-500 transition-all mr-2 hover:text-teal-500`}
            aria-label="Improve with AI"
            disabled={isProcessingAI}
          >
            <WandSparkles
              size={17}
              className={`${
                isProcessingAI
                  ? "text-teal-400 animate-pulse"
                  : "text-gray-500 hover:text-teal-400"
              }`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            className={`text-gray-500 ${
              isConfirming ? "text-red-500" : ""
            } hover:text-teal-500 transition-all`}
            aria-label="delete"
          >
            {isConfirming ? (
              <div
                className={`bg-red-500 text-white p-1 rounded transition-transform transform ${
                  isConfirming ? "translate-x-0" : "-translate-x-full"
                } w-24 delete-button`}
              >
                Delete
              </div>
            ) : (
              <Trash2 size={17} className="text-gray-500 hover:text-teal-400" />
            )}
          </button>
        </div>
      </div>
    </li>
  );
};
