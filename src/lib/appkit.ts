'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { baseAccount } from 'wagmi/connectors';
import { baseSepolia } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined');
}

const metadata = {
  name: 'MindXO',
  description: 'Play MindXO on Base',
  url: 'https://mindxo.vercel.app',
  icons: ['https://mindxo.vercel.app/logo.png']
};

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [baseSepolia],
  connectors: [
    baseAccount({
      appName: 'MindXO',
      appLogoUrl: 'https://mindxo.vercel.app/logo.png',
    }),
  ]
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  metadata,
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github'],
    swaps: false,
    onramp: false
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#22c55e',
    '--w3m-border-radius-master': '8px'
  },
  allowUnsupportedChain: false
});
