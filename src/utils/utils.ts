export interface Task {
    id: number;
    title: string;
    completed: boolean;
    notes?: string;
  }
  
  // filter tasks
  export const filterTasksByStatus = (tasks: Task[], filter: string) => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  };
  
  // Create unique ID timestamp based
  export const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };
  