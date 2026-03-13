'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { UserInfo } from './UserInfo';

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              Coach
            </Link>
            {isConnected && (
              <div className="flex items-center gap-4 text-sm">
                <Link 
                  href="/inbox" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>📥</span>
                  <span>Inbox</span>
                </Link>
                <Link 
                  href="/projects" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>📁</span>
                  <span>Projects</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>🎯</span>
                  <span>Dashboard</span>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isConnected && <UserInfo />}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
