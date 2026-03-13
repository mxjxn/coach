import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Coach Dashboard',
  projectId: 'YOUR_PROJECT_ID', // Replace with WalletConnect project ID
  chains: [mainnet, base],
  ssr: true,
});
