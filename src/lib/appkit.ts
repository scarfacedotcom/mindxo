'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { baseSepolia } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '7f100a30681d28871c0aaa5d1f6d1121';

const metadata = {
  name: 'MindXO',
  description: 'Play MindXO on Base',
  url: 'https://mindxo.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [baseSepolia]
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
