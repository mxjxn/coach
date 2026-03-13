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
