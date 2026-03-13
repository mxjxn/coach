'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { UserInfo } from './UserInfo';

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Coach Dashboard</h1>
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
