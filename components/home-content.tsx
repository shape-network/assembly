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
import { useWriteItemsCoreContractCraftItem } from '@/generated';
import { itemsCore } from '@/lib/addresses';
import { config } from '@/lib/config';
import { paths } from '@/lib/paths';
import { BlueprintComponent, Item, Molecule } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps, FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

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

const BlueprintComponentCard: FC<{ item: Item; isOwned: boolean }> = ({ item, isOwned }) => {
  const { address } = useAccount();
  const { data: inventory } = useGetMoleculesForUser();

  function isElementOwned(name: string) {
    if (!inventory) return false;
    return inventory.some((i) => i.name === name);
  }

  const isCraftable = inventory && item.blueprint.every((el) => isElementOwned(el.element.name));

  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>

        <div className="relative h-40 w-full">
          {item.defaultImageUri ? (
            <Image
              src={item.defaultImageUri}
              alt={item.name}
              fill
              className="object-contain py-2"
            />
          ) : (
            <Skeleton className="h-48 w-full" />
          )}
        </div>

        <CardContent className="flex flex-col gap-6">
          <CardDescription className="text-center italic">{item.description}</CardDescription>

          {!isOwned && (
            <div className="flex flex-wrap gap-1">
              {item.blueprint.map((el, i) => {
                const isOwned = isElementOwned(el.element.name);

                return <MoleculeBadge key={i} isOwned={isOwned} blueprintComponent={el} />;
              })}
            </div>
          )}

          <ul className="text-sm">
            {item.traits.map((trait, idx) => (
              <li key={idx} className="flex flex-col gap-1">
                <div className="text-primary flex items-center gap-2">
                  <span>{trait.name}</span>
                  <span className="border-muted-foreground/15 flex-grow border-b border-dotted"></span>
                  <span className="font-medium">{trait.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>

        {address && !isOwned && (
          <CardFooter>
            {isCraftable ? (
              <CraftItemButton item={item} />
            ) : (
              <Button disabled variant="ghost" className="-ml-4">
                Missing{' '}
                {item.blueprint
                  .filter((el) => !isElementOwned(el.element.name))
                  .map((el) => el.element.name)
                  .join(', ')}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </li>
  );
};

const CraftItemButton: FC<{ item: Item }> = ({ item }) => {
  const { data: hash, writeContractAsync, isPending } = useWriteItemsCoreContractCraftItem();
  const { refetch: refetchMolecules } = useGetMoleculesForUser();

  console.log('config.chainId', config.chainId);

  async function handleCraftItem() {
    try {
      toast.info('Please confirm the transaction in your wallet.');
      await writeContractAsync({
        address: itemsCore[config.chainId],
        args: [item.id, BigInt(1)],
      });
    } catch (error) {
      toast.error(`An error ocurred while crafting ${item.name}, please try again.`);
      console.error(error);
    }
  }

  const {
    isLoading: isTxConfirming,
    isError: isTxError,
    isSuccess: isTxConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  useEffect(() => {
    if (hash && isTxConfirming) {
      toast.loading('Item is being crafted...');
    }

    if (isTxConfirmed) {
      toast.success(`${item.name} crafted successfully!`);
      refetchMolecules();
    }

    if (isTxError) {
      toast.error(`An error ocurred while crafting ${item.name}, please try again.`);
    }
  }, [hash, refetchMolecules, isTxConfirming, isTxConfirmed, isTxError, item.name]);

  const disabled = isPending || isTxConfirming;

  return (
    <Button disabled={disabled} onClick={handleCraftItem}>
      {isPending ? 'Crafting...' : 'Craft'}
    </Button>
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
            <MoleculeBadge
              key={molecule.id}
              isOwned
              blueprintComponent={{ element: molecule, amount: 1 }}
            />
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
        <BlueprintComponentCard key={item.id} item={item} isOwned />
      ))}
    </BlueprintComponentsGrid>
  );
};

const MoleculeBadge: FC<{ blueprintComponent: BlueprintComponent; isOwned: boolean }> = ({
  blueprintComponent,
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
        {blueprintComponent.element.name}
      </PopoverTrigger>

      <PopoverContent>
        <ul>
          {isElementMolecule(blueprintComponent.element) ? (
            <>
              <li>Toughness: {blueprintComponent.element.toughness}</li>
              <li>Hardness: {blueprintComponent.element.hardness}</li>
              <li>Ductility: {blueprintComponent.element.ductility}</li>
              <li>Electrical Conductivity: {blueprintComponent.element.electrical_conductivity}</li>
              <li>Thermal Conductivity: {blueprintComponent.element.thermal_conductivity}</li>
            </>
          ) : (
            <li>item properties</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

function isElementMolecule(element: Item | Molecule): element is Molecule {
  return 'identifier' in element;
}

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
