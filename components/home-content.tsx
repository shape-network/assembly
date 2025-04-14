'use client';

import { useGetMoleculesForUser } from '@/app/api/hooks';
import { WalletConnect } from '@/components/wallet-connect';
import { FC } from 'react';
import { useAccount } from 'wagmi';

export const HomeContent: FC = () => {
  const { address } = useAccount();

  return (
    <div
      data-connected={address}
      className="group mx-auto grid min-h-screen max-w-7xl gap-4 p-5 data-connected:grid-rows-[auto_1fr]"
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
  const { data, isLoading, isError } = useGetMoleculesForUser();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  if (!data || data.length === 0) {
    return <p>No items found in your inventory.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h2 className="text-primary font-bold tracking-wide uppercase">Owned molecules</h2>
      <ul className="flex flex-wrap items-start gap-2 rounded">
        {data.map((molecule) => (
          <li
            key={molecule.id}
            className="border-border bg-primary grid aspect-square w-10 place-items-center border text-white"
          >
            {molecule.molecule?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
