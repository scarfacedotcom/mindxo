'use client';

import dynamic from 'next/dynamic';

const DynamicAppKitButton = dynamic(
  () => import('@reown/appkit/react').then((mod) => {
    const Button = () => <appkit-button />;
    return Button;
  }),
  { ssr: false }
);

export default function WalletButton() {
  return <DynamicAppKitButton />;
}
