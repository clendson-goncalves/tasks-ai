import React from 'react';

interface TaskFiltersProps {
  currentFilter: "all" | "completed" | "pending";
  onFilterChange: (filter: "all" | "completed" | "pending") => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ currentFilter, onFilterChange }) => {
  const handleFilterChange = (filter: "all" | "completed" | "pending") => {
    if (currentFilter !== filter) {
      onFilterChange(filter);
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      {["All", "Completed", "Pending"].map((label) => (
        <button
          key={label.toLowerCase()}
          onClick={() => handleFilterChange(label.toLowerCase() as "all" | "completed" | "pending")}
          className={`text-sm transition-all ${
            currentFilter === label.toLowerCase() ? "text-teal-500" : "text-gray-500"
          } hover:text-teal-400`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}; 