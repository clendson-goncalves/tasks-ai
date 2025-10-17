# Tasks AI

<img width="950" height="725" alt="interface" src="https://github.com/user-attachments/assets/46dda546-d55c-4c93-8490-481404216fce" />

A modern task management application with AI capabilities built with Next.js, TypeScript, TailwindCSS, and Supabase.

## Overview

Tasks AI is a powerful task management application that allows users to create, manage, and organize tasks with an elegant user interface. It features AI-powered task enhancement, real-time synchronization with a database, webhook integrations, and a clean, responsive design.

## Features

- Create, edit, complete, and delete tasks
- Add and edit notes for tasks
- New tasks appear at the top of the list for better visibility
- AI-powered task enhancement with one click
- Filter tasks by status (all, completed, pending)
- Track completion progress with a visual progress bar
- Real-time synchronization with Supabase backend
- Webhook integration for task events
- Responsive design for all devices

## AI Integration

Tasks AI includes a powerful AI assistant that can enhance your tasks. Click the wand icon to activate AI processing on your tasks.

## n8n Workflows

Tasks AI integrates seamlessly with [ self-hosted n8n](https://n8n.otnnek.com/) - a powerful workflow automation tool - to provide enhanced functionality for task management and communication. Two custom workflows have been designed to extend the capabilities of the application:

### 1. Task Improvement Workflow

<img width="1011" height="341" alt="task" src="https://github.com/user-attachments/assets/e9243080-ba33-42b2-98fa-85d5895334ac" />

This workflow enhances your tasks using artificial intelligence to provide more detailed information, suggestions, and next steps.

**Key Features:**

- Automatically triggers when the wand icon is clicked on a task
- Analyzes task content and generates detailed improvement suggestions
- Adds step-by-step action items to complex tasks
- Enhances task descriptions with relevant context
- Provides time estimates and priority recommendations

**How it works:**

1. The webhook from Tasks AI sends task data to n8n
2. The workflow processes the task using AI models
3. Enhanced task content is sent back to Tasks AI
4. The task notes are automatically updated with the improvements

### 2. Multi-platform Chat Workflow

<img width="982" height="415" alt="chat" src="https://github.com/user-attachments/assets/eddd899c-aa6d-41a8-8073-744565ff12ab" />

This workflow enables communication about your tasks across multiple platforms, including the web interface and WhatsApp, using the #todolist hashtag.

**Key Features:**

- Unified chat interface across web and WhatsApp
- Two-way synchronization between platforms
- Task list retrieval using #todolist command
- Task creation via chat
- Task status updates from chat messages
- Rich formatting for task lists in chat responses

**How it works:**

1. Messages from either platform are normalized and processed
2. Commands like #todolist trigger specific actions
3. The workflow queries the Tasks AI database
4. Formatted responses are sent to the appropriate platform
5. Task changes made via chat are synchronized back to the database

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database or Supabase account
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/clendson-goncalves/tasks-ai.git
cd tasks-ai
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:

Run the SQL schema in the `/sql/supabase_tasks_schema.sql` file in your Supabase project.

5. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Component Structure

```
src/
├── app/              # Next.js app router files
├── components/       # React components
│   ├── Chat/         # AI chat components
│   ├── ProgressBar   # Task progress visualization
│   ├── TaskFilters   # Task filtering options
│   ├── TaskForm      # New task creation form
│   ├── TaskItem      # Individual task component
│   ├── TaskManager   # Main task management container
│   └── WebhookModal  # Webhook configuration modal
├── utils/            # Utility functions and helpers
```

## API Documentation

### Core Types

#### Task Interface

```typescript
/**
 * Represents a task in the application
 * @typedef {Object} Task
 * @property {number} id - Unique identifier for the task
 * @property {string} title - The title/description of the task
 * @property {boolean} completed - Whether the task is completed or not
 * @property {string} [notes] - Optional notes associated with the task
 */
```

### Components

#### TaskManager

```typescript
/**
 * Main container component for task management
 * Handles task operations and maintains task order with new tasks at the top
 *
 * @component
 * @param {Object} props - Component properties
 * @param {number} props.date - The current date number
 * @param {string} props.month - The current month name
 *
 * @example
 * <TaskManager date={17} month="October" />
 */
```

#### TaskItem

```typescript
/**
 * Component for rendering an individual task item
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Task} props.task - The task to be rendered
 * @param {function} props.onDelete - Callback function to delete a task, receives task id
 * @param {function} props.onToggle - Callback function to toggle task completion, receives task id
 * @param {function} [props.onSaveNotes] - Optional callback function to save task notes, receives task id and notes
 *
 * @example
 * <TaskItem
 *   task={taskObject}
 *   onDelete={handleDeleteTask}
 *   onToggle={handleToggleTask}
 *   onSaveNotes={handleSaveNotes}
 * />
 */
```

#### TaskForm

```typescript
/**
 * Component for creating new tasks
 *
 * @component
 * @param {Object} props - Component properties
 * @param {function} props.onAddTask - Callback function when a task is added, receives task title
 *
 * @example
 * <TaskForm onAddTask={handleAddTask} />
 */
```

#### TaskFilters

```typescript
/**
 * Component for filtering tasks by status
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.currentFilter - The currently active filter ("all", "completed", or "pending")
 * @param {function} props.onFilterChange - Callback function when filter changes, receives new filter value
 *
 * @example
 * <TaskFilters currentFilter="all" onFilterChange={setFilter} />
 */
```

#### WebhookModal

```typescript
/**
 * Modal component for configuring webhooks
 *
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Callback function when modal is closed
 *
 * @example
 * <WebhookModal open={isWebhookOpen} onClose={() => setIsWebhookOpen(false)} />
 */
```

### Utility Functions

#### Task Management

```typescript
/**
 * Filters tasks based on their status
 *
 * @function
 * @param {Task[]} tasks - Array of tasks to filter
 * @param {string} filter - Filter to apply ("all", "completed", or "pending")
 * @returns {Task[]} Filtered tasks array
 */

/**
 * Generates a unique ID for a new task
 *
 * @function
 * @returns {number} A unique ID based on timestamp and random number
 */

/**
 * Adds a new task to the task list
 * New tasks are added to the top of the list for better visibility
 *
 * @function
 * @param {string} title - The title of the new task
 * @returns {void}
 */

/**
 * Sends a webhook event when a task is created, updated, or deleted
 *
 * @async
 * @function
 * @param {string} event - Event type ("task_created", "task_updated", "task_notes_updated", or "task_deleted")
 * @param {Task} task - The task associated with the event
 * @returns {Promise<void>}
 */
```

#### Supabase Integration

```typescript
/**
 * Fetches all tasks from the Supabase database
 *
 * @async
 * @function
 * @returns {Promise<SupabaseTask[]>} Array of tasks
 */

/**
 * Inserts a new task into the Supabase database
 *
 * @async
 * @function
 * @param {SupabaseTask} task - The task to insert
 * @returns {Promise<void>}
 */

/**
 * Updates a task in the Supabase database
 *
 * @async
 * @function
 * @param {number} id - The ID of the task to update
 * @param {Partial<SupabaseTask>} patch - The properties to update
 * @returns {Promise<void>}
 */

/**
 * Deletes a task from the Supabase database
 *
 * @async
 * @function
 * @param {number} id - The ID of the task to delete
 * @returns {Promise<void>}
 */
```

## Webhook Integration

Tasks AI supports webhook integration that sends JSON payloads for the following events:

- `task_created`: When a new task is created
- `task_updated`: When a task's completion status is toggled
- `task_notes_updated`: When a task's notes are updated
- `task_deleted`: When a task is deleted

Example payload:

```json
{
  "event": "task_created",
  "task": {
    "id": 1634567890123,
    "title": "Complete project documentation",
    "completed": false,
    "notes": null
  },
  "timestamp": "2025-10-17T14:30:00.000Z"
}
```

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.io/) - Open source Firebase alternative
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
