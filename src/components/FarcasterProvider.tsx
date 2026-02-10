'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initFarcaster = async () => {
      try {
        // Check if running in Farcaster context
        const context = await sdk.context;
        if (context) {
          // Signal that the app is ready
          sdk.actions.ready();
          console.log('Farcaster SDK ready');
        }
      } catch (error) {
        // Not in Farcaster context, ignore
        console.log('Not running in Farcaster context');
      }
    };

    initFarcaster();
  }, []);

  return <>{children}</>;
}
