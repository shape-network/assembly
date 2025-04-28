'use client';

import { useGetOtomItemsForUser } from '@/app/api/hooks';
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
import { useWriteItemsCoreContractCraftItem } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { config } from '@/lib/config';
import { BlueprintComponent, Item, Molecule, Trait } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FC, useEffect } from 'react';
import { toast } from 'sonner';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

export const ItemToCraftCard: FC<{ item: Item }> = ({ item }) => {
  const { address } = useAccount();
  const { data: inventory } = useGetOtomItemsForUser();

  function isElementOwned(name: string) {
    if (!inventory) return false;
    return inventory.some((i) => i.name === name);
  }

  console.log('item', item);

  const isCraftable =
    inventory &&
    item.blueprint.length > 0 &&
    item.blueprint.every((el) => isElementOwned(el.element.name));

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

          <div className="flex flex-wrap gap-1">
            {item.blueprint.map((el, i) => {
              const isOwned = isElementOwned(el.element.name);

              return <OtomItemCard key={i} isOwned={isOwned} blueprintComponent={el} />;
            })}
          </div>

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

        {address && (
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

export const OtomItemCard: FC<{ blueprintComponent: BlueprintComponent; isOwned: boolean }> = ({
  blueprintComponent,
  isOwned,
}) => {
  console.log('blueprintComponent', blueprintComponent.element.id);
  return (
    <div
      className={cn(
        'bg-card border-primary relative grid size-15 cursor-pointer place-items-center rounded border p-2 text-lg font-semibold'
      )}
    >
      {blueprintComponent.element.name}
    </div>
  );
};

function isElementMolecule(element: Item | Molecule): element is Molecule {
  return 'identifier' in element;
}

const CraftItemButton: FC<{ item: Item }> = ({ item }) => {
  const { data: hash, writeContractAsync, isPending } = useWriteItemsCoreContractCraftItem();
  const { refetch: refetchOtomItems } = useGetOtomItemsForUser();

  async function handleCraftItem() {
    try {
      toast.info('Please confirm the transaction in your wallet.');
      await writeContractAsync({
        address: assemblyCore[config.chainId],
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
      refetchOtomItems();
    }

    if (isTxError) {
      toast.error(`An error ocurred while crafting ${item.name}, please try again.`);
    }
  }, [hash, refetchOtomItems, isTxConfirming, isTxConfirmed, isTxError, item.name]);

  const disabled = isPending || isTxConfirming;

  return (
    <Button disabled={disabled} onClick={handleCraftItem}>
      {isPending ? 'Crafting...' : 'Craft'}
    </Button>
  );
};

export const OwnedItemCard: FC<{ item: Item }> = ({ item }) => {
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
          <ItemTraits traits={item.traits} />
        </CardContent>
      </Card>
    </li>
  );
};

const ItemTraits: FC<{ traits: Trait[] }> = ({ traits }) => {
  return (
    <ul className="text-sm">
      {traits.map((trait, idx) => (
        <li key={idx} className="flex flex-col gap-1">
          <div className="text-primary flex items-center gap-2">
            <span>{trait.name}</span>
            <span className="border-muted-foreground/15 flex-grow border-b border-dotted"></span>
            <span className="font-medium">{trait.value}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
