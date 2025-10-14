"use client";

import { Trash2, NotebookPen } from "lucide-react";
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
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [editNotes, setEditNotes] = useState("");
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
      setIsNotesOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li
      ref={itemRef}
      className={`flex items-center gap-3 py-2 px-2 group rounded-lg transition-colors ${
        isNotesOpen ? "" : "hover:bg-gray-700/70"
      } relative`}
    >
      <div className="w-full">
        <div className="w-full flex gap-3 items-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            aria-label="toggle task"
            className={`w-4 h-4 rounded-full border transition-all ${
              task.completed
                ? "border-green-500 bg-green-500"
                : `border-gray-600 ${isNotesOpen ? "" : "hover:border-sky-400"}`
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

          <div className="flex-grow" onClick={() => onToggle(task.id)}>
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsNotesOpen(true);
              setEditNotes(task.notes ?? "");
            }}
            className={`text-gray-500 transition-all mr-2 ${
              isNotesOpen ? "" : "hover:text-teal-500"
            }`}
            aria-label="notes"
          >
            <NotebookPen
              size={17}
              className="text-gray-500 hover:text-teal-400"
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            className={`text-gray-500 ${isConfirming ? "text-red-500" : ""} ${
              isNotesOpen ? "" : "hover:text-teal-500"
            } transition-all`}
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

        {isNotesOpen && (
          <div className="w-full mt-4">
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={4}
              className="w-full bg-transparent text-white placeholder-gray-500 border border-gray-700 text-sm rounded-md p-2 focus:outline-none"
              placeholder="Add notes for this task..."
            />

            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsNotesOpen(false);
                  setEditNotes(task.notes ?? "");
                }}
                className="bg-gray-700 text-white p-1 rounded text-sm w-24 hover:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (typeof onSaveNotes === "function")
                    onSaveNotes(task.id, editNotes);
                  setIsNotesOpen(false);
                }}
                className="bg-teal-500 text-white p-1 rounded text-sm w-24 hover:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};
