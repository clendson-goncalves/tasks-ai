"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../utils/utils';

interface TaskNotesModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (id: number, notes: string) => void;
}

export const TaskNotesModal: React.FC<TaskNotesModalProps> = ({ open, task, onClose, onSave }) => {
  const [notes, setNotes] = useState('');
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (task) setNotes(task.notes ?? '');
    if (!open) setNotes('');
  }, [task, open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={(e) => {
          // close when clicking overlay only
          if (e.target === e.currentTarget) onClose();
        }}
      />

      <div ref={dialogRef} className="relative w-full max-w-md mx-4">
        <div className="bg-gray-900 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg mb-3">Notes for: {task.title}</h3>

          <textarea
            autoFocus
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none border border-gray-800 rounded-lg p-3 resize-none"
            placeholder="Add your notes here..."
          />

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onSave(task.id, notes);
                onClose();
              }}
              className="px-3 py-2 rounded bg-teal-500  text-white font-medium text-sm hover:opacity-65"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskNotesModal;
