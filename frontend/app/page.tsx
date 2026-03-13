'use client';

import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Goals } from '@/components/Goals';
import { Tasks } from '@/components/Tasks';
import { CheckIns } from '@/components/CheckIns';

export default function Dashboard() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">
                Welcome to Coach Dashboard
              </h1>
              <p className="mb-8 text-lg text-gray-400">
                Connect your wallet to access your dashboard
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Track your goals, tasks, and check-ins
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Goals />
          </div>
          <div>
            <Tasks />
          </div>
          <div>
            <CheckIns />
          </div>
        </div>
      </main>
    </div>
  );
}
