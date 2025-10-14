import { useEffect, useState } from "react";

interface ProgressBarProps {
  total: number;
  completed: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ total, completed }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const progressPercentage = total ? (completed / total) * 100 : 0;
  const width = mounted ? `${progressPercentage}%` : "0%";

  return (
    <div className="mb-6">
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
        <div role="progressbar" className="h-full transition-all duration-500 ease-out bg-gradient-to-r from-teal-500 to-green-500" style={{ width }} />
      </div>
      {mounted && <p className="text-xs text-gray-500">{completed} of {total} tasks completed</p>}
    </div>
  );
};