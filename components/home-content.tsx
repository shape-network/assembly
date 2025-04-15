'use client';

import { useGetCraftableItems, useGetMoleculesForUser } from '@/app/api/hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletConnect } from '@/components/wallet-connect';
import { formatProperty, formatPropertyValue } from '@/lib/otoms';
import { FC, ReactNode } from 'react';
import { useAccount } from 'wagmi';

export const HomeContent: FC = () => {
  const { address } = useAccount();

  return (
    <div
      data-connected={address}
      className="group mx-auto grid min-h-screen max-w-7xl gap-4 p-5 data-connected:grid-rows-[auto_1fr]"
    >
      <header className="flex items-center justify-between">
        <div className="relative">
          <h1 className="text-primary text-2xl font-semibold tracking-wide uppercase">Assembly</h1>
          <span className="text-muted-foreground/50 absolute -bottom-5 left-0 text-sm whitespace-nowrap">
            An otom-based item crafter
          </span>
        </div>

        <div className="hidden group-data-connected:flex">
          <WalletConnect />
        </div>
      </header>

      <main className="flex flex-col items-center justify-start gap-8 py-12">
        {address ? (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2">
              <h2 className="text-primary font-bold tracking-wide uppercase">Items to craft</h2>
              <ItemsToCraft />
            </div>

            <div className="flex w-full flex-col gap-2">
              <h2 className="text-primary font-bold tracking-wide uppercase">Owned molecules</h2>
              <Inventory />
            </div>
          </div>
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
  const { data, isLoading, isError } = useGetCraftableItems();

  if (isLoading) {
    return <ItemsToCraftSkeleton />;
  }

  if (!data || isError) {
    return <p>Error loading items to craft.</p>;
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {data.map((item) => (
        <li key={item.id}>
          <Card>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-1">
                {item.recipe.map((el, i) => (
                  <MoleculeBadge key={i}>{el}</MoleculeBadge>
                ))}
              </div>

              <ul className="text-sm">
                {item.properties.map((prop, idx) => (
                  <li key={idx} className="flex flex-col gap-1">
                    {Object.entries(prop)
                      .filter(([, value]) => value !== undefined)
                      .map(([key, value]) => (
                        <div key={key} className="text-primary flex items-center gap-2">
                          <span>{formatProperty(key)}</span>
                          <span className="border-muted-foreground/15 flex-grow border-b border-dotted"></span>
                          <span className="font-medium">{formatPropertyValue(value)}</span>
                        </div>
                      ))}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {Math.random() > 0.5 ? (
                <Button>Craft</Button>
              ) : (
                <span className="text-muted-foreground/50 text-xs">Missing elements</span>
              )}
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
};

const Inventory: FC = () => {
  const { data, isLoading, isError } = useGetMoleculesForUser();

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  if (!data || data.length === 0) {
    return <p>No items found in your inventory.</p>;
  }

  return (
    <Card>
      <CardContent>
        <ul className="flex flex-wrap items-start gap-2 rounded">
          {data.map((molecule) => (
            <MoleculeBadge key={molecule.id}>{molecule.molecule?.name}</MoleculeBadge>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const MoleculeBadge: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="bg-muted text-muted-foreground rounded px-2 py-1">{children}</div>;
};

const InventorySkeleton: FC = () => {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {Array.from({ length: 75 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-10" />
      ))}
    </div>
  );
};

const ItemsToCraftSkeleton: FC = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-40 w-full" />
      ))}
    </div>
  );
};
