'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

interface Task {
  id: number;
  goal_id: number | null;
  title: string;
  description: string | null;
  status: string;
  priority: number;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  goal_title?: string;
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({});

  useEffect(() => {
    fetchTask();
  }, [resolvedParams.id]);

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${resolvedParams.id}`);
      if (!res.ok) throw new Error('Failed to fetch task');
      const data = await res.json();
      setTask(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/tasks/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTask(updated);
      setEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Task not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="bg-gray-900 rounded-lg p-6">
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white h-32"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority || 2}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value={1}>High</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date || ''}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
                    Task
                  </span>
                  <h1 className="text-3xl font-bold">{task.title}</h1>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
              </div>

              {task.description && (
                <p className="text-gray-300 mb-4">{task.description}</p>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 font-medium capitalize ${
                    task.status === 'done' ? 'text-green-400' :
                    task.status === 'in_progress' ? 'text-blue-400' :
                    task.status === 'blocked' ? 'text-red-400' :
                    'text-gray-300'
                  }`}>{task.status}</span>
                </div>
                <div>
                  <span className="text-gray-400">Priority:</span>
                  <span className="ml-2 font-medium">
                    {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}
                  </span>
                </div>
                {task.due_date && (
                  <div>
                    <span className="text-gray-400">Due:</span>
                    <span className="ml-2">{new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {task.goal_title && (
                <div className="mt-4 p-4 bg-gray-800 rounded">
                  <span className="text-xs uppercase tracking-wider text-gray-400">Linked Goal:</span>
                  <p className="text-gray-300 mt-1">{task.goal_title}</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
