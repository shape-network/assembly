'use client';

import { WalletConnect } from '@/components/wallet-connect';
import { FC } from 'react';
import { useAccount } from 'wagmi';

export const HomeContent: FC = () => {
  const { address } = useAccount();

  return (
    <div
      data-connected={address}
      className="group grid min-h-screen gap-4 p-5 data-connected:grid-rows-[auto_1fr]"
    >
      <header className="hidden justify-end group-data-connected:flex">
        <WalletConnect />
      </header>

      <main className="flex flex-col items-center justify-center gap-8">
        {address ? (
          <ItemsToCraft />
        ) : (
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-primary text-4xl font-bold">ASSEMBLY</h1>
            <p className="text-xl">An otom-based item crafter</p>
            <WalletConnect />
          </div>
        )}
      </main>
    </div>
  );
};

const ItemsToCraft: FC = () => {
  return (
    <div>
      <h1>Items To Craft</h1>
    </div>
  );
};
