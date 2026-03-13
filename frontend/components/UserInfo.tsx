'use client';

import { useAccount, useEnsName } from 'wagmi';

export function UserInfo() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // Ethereum mainnet
  });

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
        {ensName ? ensName.slice(0, 2).toUpperCase() : address.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-white">
          {ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
        {!ensName && (
          <span className="text-xs text-gray-400">
            {address.slice(0, 10)}...{address.slice(-8)}
          </span>
        )}
      </div>
    </div>
  );
}
