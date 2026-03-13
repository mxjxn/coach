'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

interface Goal {
  id: number;
  category: string | null;
  title: string;
  description: string | null;
  priority: number;
  status: string;
  created_at: string;
  updated_at: string;
  target_date: string | null;
}

interface Task {
  id: number;
  goal_id: number | null;
  title: string;
  description: string | null;
  status: string;
  priority: number;
  due_date: string | null;
  completed_at: string | null;
  goal_title?: string;
}

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Goal>>({});

  useEffect(() => {
    fetchGoal();
    fetchTasks();
  }, [resolvedParams.id]);

  const fetchGoal = async () => {
    try {
      const res = await fetch(`/api/goals/${resolvedParams.id}`);
      if (!res.ok) throw new Error('Failed to fetch goal');
      const data = await res.json();
      setGoal(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      const goalTasks = data.filter((t: Task) => t.goal_id === parseInt(resolvedParams.id));
      setTasks(goalTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/goals/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update goal');
      const updated = await res.json();
      setGoal(updated);
      setEditing(false);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!goal) {
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
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Goal Not Found</h1>
            <p className="text-gray-400 mb-4">
              This goal may have been deleted or doesn't exist.
            </p>
            <p className="text-sm text-gray-500">
              Goal ID: {resolvedParams.id}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
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

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
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
              <div className="grid grid-cols-2 gap-4">
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
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
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
                    {goal.category || 'Uncategorized'}
                  </span>
                  <h1 className="text-3xl font-bold">{goal.title}</h1>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
              </div>

              {goal.description && (
                <p className="text-gray-300 mb-4">{goal.description}</p>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Priority:</span>
                  <span className="ml-2 font-medium">
                    {goal.priority === 1 ? 'High' : goal.priority === 2 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="ml-2 font-medium capitalize">{goal.status}</span>
                </div>
                {goal.target_date && (
                  <div>
                    <span className="text-gray-400">Target:</span>
                    <span className="ml-2">{new Date(goal.target_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Related Tasks */}
        {tasks.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Related Tasks ({tasks.length})</h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="bg-gray-800 rounded p-4 hover:bg-gray-750 cursor-pointer"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'done' ? 'bg-green-900 text-green-300' :
                      task.status === 'in_progress' ? 'bg-blue-900 text-blue-300' :
                      task.status === 'blocked' ? 'bg-red-900 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
