'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

type TaskStatus = 'pending' | 'in-progress' | 'done';

interface Task {
  id: number;
  goal_id: number | null;
  title: string;
  description: string;
  priority: number;
  status: TaskStatus;
  created_at: string;
  due_date: string | null;
  completed_at: string | null;
  goal_title: string | null;
}

export function Tasks() {
  const { isConnected } = useAccount();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
    due_date: ''
  });

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', priority: 2, due_date: '' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const statusColors: Record<TaskStatus, string> = {
    pending: 'bg-yellow-600',
    'in-progress': 'bg-blue-600',
    done: 'bg-green-600',
  };

  const statusLabels: Record<TaskStatus, string> = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    done: 'Done',
  };

  const priorityColors: Record<number, string> = {
    1: 'text-red-400',
    2: 'text-yellow-400',
    3: 'text-gray-400',
  };

  const priorityLabels: Record<number, string> = {
    1: 'high',
    2: 'medium',
    3: 'low',
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Pending Tasks</h2>
        <p className="text-gray-400">Connect your wallet to view your tasks</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Pending Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-4">
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                placeholder="Task title"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                rows={3}
                placeholder="Describe your task"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                >
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center text-gray-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-400">No pending tasks. Add a task to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{task.title}</span>
                  {task.goal_title && (
                    <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
                      {task.goal_title}
                    </span>
                  )}
                  <span className={`text-xs uppercase ${priorityColors[task.priority]}`}>
                    {priorityLabels[task.priority]}
                  </span>
                </div>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-400">{task.description}</p>
                )}
                {task.due_date && (
                  <p className="mt-2 text-xs text-gray-500">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="ml-4 flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${statusColors[task.status]}`}
                />
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                  className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white"
                >
                  <option value="pending">{statusLabels.pending}</option>
                  <option value="in-progress">{statusLabels['in-progress']}</option>
                  <option value="done">{statusLabels.done}</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
