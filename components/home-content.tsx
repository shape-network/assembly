'use client';

import { useGetCraftableItems, useGetItemsForUser, useGetOtomItemsForUser } from '@/app/api/hooks';
import { ItemToCraftCard, OtomItemCard, OwnedItemCard } from '@/components/item';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletConnect } from '@/components/wallet-connect';
import { paths } from '@/lib/paths';
import { cn } from '@/lib/utils';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

export const HomeContent: FC = () => {
  const { address } = useAccount();

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-rows-[auto_1fr] gap-4 p-5">
      <header className="flex items-center justify-between">
        <div className="relative">
          <h1 className="text-primary text-2xl font-semibold tracking-wide uppercase">
            <Link href={paths.home}>Assembly</Link>
          </h1>
          <span className="text-muted-foreground/50 absolute -bottom-5 left-0 text-sm whitespace-nowrap">
            An otom-based item crafter
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="link">
            <a href={paths.otom} target="_blank" rel="noopener noreferrer">
              otom.xyz
            </a>
          </Button>

          <WalletConnect />
        </div>
      </header>

      <main className="flex flex-col justify-start gap-8 py-12">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-primary font-bold tracking-wide uppercase">Items to craft</h2>
              <InlineLink
                href={paths.repo}
                className="text-muted-foreground/50 text-sm no-underline hover:underline"
              >
                Propose your own <ExternalLinkIcon className="size-4" />
              </InlineLink>
            </div>
            <ItemsToCraft />
          </div>

          {address ? (
            <div className="flex flex-col gap-16">
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-primary font-bold tracking-wide uppercase">Owned otoms</h2>
                  <InlineLink
                    href={paths.otom}
                    className="text-muted-foreground/50 text-sm no-underline hover:underline"
                  >
                    Mine more otoms <ExternalLinkIcon className="size-4" />
                  </InlineLink>
                </div>
                <OtomsInventory />
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-primary font-bold tracking-wide uppercase">Owned Items</h2>
                </div>
                <ItemsInventory />
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-8">
              <div className="flex flex-col gap-4">
                <p>
                  Assembly is an open-source item crafting tool on{' '}
                  <InlineLink href={paths.otom}>Shape</InlineLink>, based on the world of{' '}
                  <InlineLink href={paths.otom}>Otoms</InlineLink>.
                </p>
                <p>
                  It&apos;s In esse ullamco in mollit mollit irure laboris irure consectetur aliqua
                  cillum velit duis commodo incididunt. Quis anim consectetur fugiat dolore occaecat
                  nulla ipsum enim laborum ut sint ut.
                </p>
                <InlineLink className="self-start" href={paths.otom}>
                  View source code
                </InlineLink>
              </div>

              <div className="flex w-full flex-col items-center gap-2">
                <WalletConnect />
              </div>
            </div>
          )}
        </div>
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
    <BlueprintComponentsGrid>
      {data.map((item) => (
        <ItemToCraftCard key={item.id} item={item} />
      ))}
    </BlueprintComponentsGrid>
  );
};

const BlueprintComponentsGrid: FC<PropsWithChildren> = ({ children }) => {
  return <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">{children}</ul>;
};

const OtomsInventory: FC = () => {
  const { data, isLoading, isError } = useGetOtomItemsForUser();

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid place-items-center gap-4 py-12">
        <p>No otoms found in your wallet.</p>

        <Button asChild>
          <a href={paths.otom} target="_blank" rel="noopener noreferrer">
            Get otoms
          </a>
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex flex-wrap items-start gap-2 rounded">
      {data.map((element) => (
        <OtomItemCard key={element.id} element={element} />
      ))}
    </ul>
  );
};

const ItemsInventory: FC = () => {
  const { data, isLoading, isError } = useGetItemsForUser();

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  if (!data || data.length === 0)
    return (
      <Card>
        <CardContent className="grid place-items-center gap-4 py-12">
          <p>No items found in your wallet.</p>
        </CardContent>
      </Card>
    );

  return (
    <BlueprintComponentsGrid>
      {data.map((item) => (
        <OwnedItemCard key={item.id} item={item} />
      ))}
    </BlueprintComponentsGrid>
  );
};

const InventorySkeleton: FC = () => {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {Array.from({ length: 25 }).map((_, index) => (
        <Skeleton key={index} className="size-15" />
      ))}
    </div>
  );
};

const ItemsToCraftSkeleton: FC = () => {
  return (
    <BlueprintComponentsGrid>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index}>
          <Skeleton className="h-96 w-full" />
        </li>
      ))}
    </BlueprintComponentsGrid>
  );
};

const InlineLink: FC<PropsWithChildren<ComponentProps<'a'>>> = ({ children, href, className }) => {
  return (
    <a
      className={cn(
        'inline-flex items-center gap-x-2 font-medium underline hover:no-underline',
        className
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
