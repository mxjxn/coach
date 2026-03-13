'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Goals } from '@/components/Goals';
import { Tasks } from '@/components/Tasks';
import { CheckIns } from '@/components/CheckIns';

export default function DashboardPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">
                Connect Your Wallet
              </h1>
              <p className="mb-8 text-lg text-gray-400">
                Use the Connect button in the navbar to access your personal dashboard
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
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Track your goals, tasks, and check-ins
          </p>
        </div>

        {/* GTD Flow */}
        <div className="mb-8 rounded-lg border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Getting Things Done Flow</h2>
          <div className="flex items-center justify-between text-lg">
            <Link href="/inbox" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-4xl">📥</span>
              <span className="font-medium">Inbox</span>
              <span className="text-xs text-gray-400">Capture</span>
            </Link>
            <span className="text-2xl text-gray-600">→</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">💭</span>
              <span className="font-medium text-gray-400">Thought</span>
              <span className="text-xs text-gray-500">Clarify</span>
            </div>
            <span className="text-2xl text-gray-600">→</span>
            <Link href="/projects" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-4xl">📁</span>
              <span className="font-medium">Project</span>
              <span className="text-xs text-gray-400">Organize</span>
            </Link>
            <span className="text-2xl text-gray-600">→</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">✅</span>
              <span className="font-medium text-gray-400">Task</span>
              <span className="text-xs text-gray-500">Engage</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400 text-center">
            The act of categorizing IS the clarity. Everything starts in inbox.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Link
            href="/inbox"
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">📥 Inbox</h3>
                <p className="text-sm text-gray-400">Uncaptured thoughts</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">📁 Projects</h3>
                <p className="text-sm text-gray-400">Active projects</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">🎯 Goals</h3>
                <p className="text-sm text-gray-400">Personal & time-bound</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">✅ Tasks</h3>
                <p className="text-sm text-gray-400">Action items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Goals categoryFilter="projects" />
          </div>
          <div>
            <Goals categoryFilter="personal" />
          </div>
          <div>
            <Goals categoryFilter="timebound" />
          </div>
        </div>
        <div className="mt-6">
          <Tasks />
        </div>
      </main>
    </div>
  );
}
