'use client';

import { useGetCraftableItems, useGetItemsForUser, useGetMoleculesForUser } from '@/app/api/hooks';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletConnect } from '@/components/wallet-connect';
import { formatProperty, formatPropertyValue } from '@/lib/otoms';
import { paths } from '@/lib/paths';
import { BlueprintComponent } from '@/lib/types';
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
                  <h2 className="text-primary font-bold tracking-wide uppercase">
                    Owned Molecules
                  </h2>
                  <InlineLink
                    href={paths.otom}
                    className="text-muted-foreground/50 text-sm no-underline hover:underline"
                  >
                    Mine more otoms <ExternalLinkIcon className="size-4" />
                  </InlineLink>
                </div>
                <MoleculesInventory />
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
        <BlueprintComponentCard key={item.id} item={item} isOwned={false} />
      ))}
    </BlueprintComponentsGrid>
  );
};

const BlueprintComponentsGrid: FC<PropsWithChildren> = ({ children }) => {
  return <ul className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">{children}</ul>;
};

const BlueprintComponentCard: FC<{ item: BlueprintComponent; isOwned: boolean }> = ({
  item,
  isOwned,
}) => {
  const { data: inventory } = useGetMoleculesForUser();

  function isElementOwned(name: string) {
    if (!inventory) return false;
    return inventory.some((i) => i.name === name);
  }

  function isItemCraftable(item: BlueprintComponent) {
    if (!inventory) return false;
    return item.blueprint.every((el) => isElementOwned(el.name));
  }

  const isCraftable = isItemCraftable(item);

  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {!isOwned && (
            <div className="flex flex-wrap gap-1">
              {item.blueprint.map((el, i) => {
                const isOwned = isElementOwned(el.name);

                return <MoleculeBadge key={i} isOwned={isOwned} element={el} />;
              })}
            </div>
          )}

          <ul className="text-sm">
            {item.traits.map((prop, idx) => (
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

        {!isOwned && (
          <CardFooter>
            {isCraftable ? (
              <Button>Craft</Button>
            ) : (
              <Button disabled variant="ghost" className="-ml-4">
                Missing{' '}
                {item.blueprint
                  .filter((el) => !isElementOwned(el.name))
                  .map((el) => el.name)
                  .join(', ')}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </li>
  );
};

const MoleculesInventory: FC = () => {
  const { data, isLoading, isError } = useGetMoleculesForUser();

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="grid place-items-center gap-4 py-12">
          <p>No molecules found in your wallet.</p>
          <Button asChild>
            <a href={paths.otom} target="_blank" rel="noopener noreferrer">
              Get Molecules
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <ul className="flex flex-wrap items-start gap-2 rounded">
          {data.map((molecule) => (
            <MoleculeBadge key={molecule.id} isOwned element={molecule} />
          ))}
        </ul>
      </CardContent>
    </Card>
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

  if (!data || data.length === 0) return null;

  return (
    <BlueprintComponentsGrid>
      {data.map((item) => (
        <BlueprintComponentCard key={item.id} item={item} isOwned />
      ))}
    </BlueprintComponentsGrid>
  );
};

const MoleculeBadge: FC<{ element: BlueprintComponent; isOwned: boolean }> = ({
  element,
  isOwned,
}) => {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'cursor-pointer rounded px-2 py-1',
          isOwned ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
        )}
      >
        {element.name}
      </PopoverTrigger>

      <PopoverContent>
        <ul>
          {element.traits.length > 0 ? (
            element.traits.map((trait, idx) => (
              <li key={idx}>
                {Object.entries(trait)
                  .filter(([, value]) => value !== undefined)
                  .map(([key, value]) => (
                    <div key={key}>
                      {formatProperty(key)}: {formatPropertyValue(value)}
                    </div>
                  ))}
              </li>
            ))
          ) : (
            <li>Molecule traits</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const InventorySkeleton: FC = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap items-start gap-2">
          {Array.from({ length: 75 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-10" />
          ))}
        </div>
      </CardContent>
    </Card>
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
