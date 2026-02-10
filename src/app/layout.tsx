import type { Metadata } from 'next';
import './globals.css';
import AppKitProviderWrapper from '@/components/AppKitProviderWrapper';
import FarcasterProvider from '@/components/FarcasterProvider';

export const metadata: Metadata = {
  title: 'MindXO - Play for USDC on Base',
  description: 'Play MindXO with AI or compete for USDC prizes on Base blockchain',
  manifest: '/.well-known/farcaster.json',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/logo.png',
  },
  openGraph: {
    title: 'MindXO - Play for USDC on Base',
    description: 'AI Mode (FREE) or PvP Mode ($1 USDC) - Win $1.70 USDC prizes!',
    images: ['/frame-image.svg'],
    type: 'website',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://mindxo.vercel.app/frame-image.svg',
    'fc:frame:button:1': '🎮 Play Now',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://mindxo.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="manifest" href="/.well-known/farcaster.json" />
      </head>
      <body>
        {/* Decorative floating X and O elements */}
        <div className="decorative-x" style={{ fontSize: '150px', top: '10%', left: '15%', opacity: 0.08 }}>X</div>
        <div className="decorative-o" style={{ fontSize: '180px', top: '60%', right: '10%', opacity: 0.06 }}>O</div>
        <div className="decorative-x" style={{ fontSize: '120px', bottom: '15%', right: '20%', opacity: 0.07 }}>X</div>
        <div className="decorative-o" style={{ fontSize: '140px', top: '30%', left: '5%', opacity: 0.05 }}>O</div>

        <FarcasterProvider>
          <AppKitProviderWrapper>
            {children}
          </AppKitProviderWrapper>
        </FarcasterProvider>
      </body>
    </html>
  );
}
