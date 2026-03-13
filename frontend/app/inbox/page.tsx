'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

interface InboxItem {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

export default function InboxPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const fetchInbox = async () => {
    try {
      // Fetch uncategorized items (status='inbox' or category=null)
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        const inboxItems = data.filter((g: InboxItem) => 
          !g.category || g.category === 'inbox' || g.status === 'inbox'
        );
        setItems(inboxItems);
      }
    } catch (error) {
      console.error('Error fetching inbox:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchInbox();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'inbox',
          priority: 3
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', category: '' });
        fetchInbox();
      }
    } catch (error) {
      console.error('Error creating inbox item:', error);
    }
  };

  const categorizeItem = async (id: number, category: string) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category, 
          status: 'active' 
        }),
      });

      if (response.ok) {
        fetchInbox();
      }
    } catch (error) {
      console.error('Error categorizing item:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">Connect Your Wallet</h1>
              <p className="mb-8 text-lg text-gray-400">
                Use the Connect button to access your inbox
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">📥 GTD Inbox</h1>
          <p className="mt-2 text-gray-400">
            Capture everything here first. Categorize later.
          </p>
        </div>

        {/* Quick Add Form */}
        <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Quick Capture'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  placeholder="What's on your mind?"
                  required
                  autoFocus
                />
              </div>
              <div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  rows={2}
                  placeholder="Optional notes"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Capture to Inbox
              </button>
            </form>
          )}
        </div>

        {/* Inbox Items */}
        {loading ? (
          <div className="text-center text-gray-400">Loading inbox...</div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
            <p className="text-gray-400 mb-2">🎉 Inbox zero!</p>
            <p className="text-sm text-gray-500">Capture anything on your mind using the button above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4"
              >
                <div className="mb-3">
                  <h3 className="font-medium text-white">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Captured: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Quick Categorize Buttons */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-400 self-center mr-2">Categorize as:</span>
                  <button
                    onClick={() => categorizeItem(item.id, 'projects')}
                    className="rounded bg-purple-900/50 px-3 py-1 text-xs text-purple-300 hover:bg-purple-800"
                  >
                    📁 Project
                  </button>
                  <button
                    onClick={() => categorizeItem(item.id, 'personal')}
                    className="rounded bg-green-900/50 px-3 py-1 text-xs text-green-300 hover:bg-green-800"
                  >
                    🎯 Personal
                  </button>
                  <button
                    onClick={() => categorizeItem(item.id, 'timebound')}
                    className="rounded bg-orange-900/50 px-3 py-1 text-xs text-orange-300 hover:bg-orange-800"
                  >
                    ⏰ Time-Bound
                  </button>
                  <button
                    onClick={() => router.push(`/goals/${item.id}`)}
                    className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-600"
                  >
                    Edit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GTD Flow Info */}
        <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/30 p-6">
          <h2 className="text-lg font-semibold mb-3">Getting Things Done Flow</h2>
          <div className="grid gap-2 text-sm text-gray-400 sm:grid-cols-7">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📥</span>
              <span>Inbox</span>
            </div>
            <div className="flex items-center gap-2">
              <span>→</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">💭</span>
              <span>Thought</span>
            </div>
            <div className="flex items-center gap-2">
              <span>→</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">📁</span>
              <span>Project</span>
            </div>
            <div className="flex items-center gap-2">
              <span>→</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Task</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            The act of categorizing IS the clarity. Everything starts in inbox.
          </p>
        </div>
      </main>
    </div>
  );
}
