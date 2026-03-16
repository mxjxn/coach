import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, mainnet } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Coach Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // Replace with WalletConnect project ID
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY'),
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY')
  }, // Use Alchemy RPCs as custom transports
  ssr: true,
});