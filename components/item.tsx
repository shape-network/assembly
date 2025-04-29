'use client';

import { useGetCraftableItems, useGetOtomItemsForUser } from '@/app/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWriteAssemblyCoreContractCraftItem } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { config } from '@/lib/config';
import { Item, OtomItem, Trait } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LightningBoltIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
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

  const isCraftable =
    inventory &&
    item.blueprint.length > 0 &&
    item.blueprint.every((component) => isElementOwned(component.name));

  const requiredBlueprints = item.blueprint.filter((i) => i.componentType !== 'variable_otom');
  const variableBlueprints = item.blueprint.filter((i) => i.componentType === 'variable_otom');

  return (
    <li className="grid grid-rows-[1fr_auto] gap-1">
      <Card className="relative w-full">
        {isCraftable && address && (
          <CraftItemButton item={item} className="absolute top-2 right-2 h-8 px-3" />
        )}

        <CardHeader className="relative">
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex h-full flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
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

            <CardDescription className="text-center italic">{item.description}</CardDescription>

            <ul className="text-sm">
              {item.initialTraits.map((trait, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <div className="text-primary flex items-center gap-2">
                    <span>{trait.name === 'Usages Remaining' ? 'Usages' : trait.name}</span>
                    <span className="border-muted-foreground/15 flex-grow border-b border-dotted"></span>
                    <span className="font-medium">{trait.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">Required elements</p>
              <div className="flex flex-wrap gap-1">
                {requiredBlueprints.map((component, i) => {
                  const isOwned = isElementOwned(component.name);
                  return (
                    <Card
                      key={i}
                      className={cn(
                        'py-0',
                        isOwned
                          ? 'bg-primary border-primary font-semibold text-white'
                          : 'text-muted-foreground/50 border-border'
                      )}
                    >
                      <CardContent className="grid size-15 place-items-center px-0">
                        {component.name}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {variableBlueprints.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground flex items-center gap-1 text-sm">
                  Enhancements{' '}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <QuestionMarkCircledIcon className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Enhance the {item.name} with otoms that match specific criteria. The higher
                        the value, the better the effect applied to the item.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </p>

                <div className="flex justify-start gap-1">
                  {variableBlueprints.map((vb, i) => {
                    console.log('vb', vb);
                    return (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <Card className="py-0">
                            <CardContent className="text-muted-foreground/40 grid size-15 place-items-center px-0">
                              <LightningBoltIcon className="size-4" />
                            </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex flex-col gap-1">
                            {vb.criteria.map((c) => (
                              <span key={c.propertyType}>
                                <p>{c.propertyType}</p>
                                <p>
                                  Range: {c.minValue} - {c.maxValue}
                                </p>
                              </span>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-[90px] items-center justify-start">
                <p className="text-muted-foreground text-sm">No enhancements available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </li>
  );
};

export const OtomItemCard: FC<{ element: OtomItem }> = ({ element }) => {
  const { data } = useGetCraftableItems();
  const isElementInBlueprint = data?.some((i) => i.blueprint.some((b) => b.name === element.name));

  return (
    <Card
      className={cn(
        'border-primary py-0 font-semibold',
        isElementInBlueprint ? 'bg-primary text-white' : ''
      )}
    >
      <CardContent className="grid size-15 place-items-center px-0">{element.name}</CardContent>
    </Card>
  );
};

const CraftItemButton: FC<{ item: Item; className?: string }> = ({ item, className }) => {
  const { data: hash, writeContractAsync, isPending } = useWriteAssemblyCoreContractCraftItem();
  const { refetch: refetchOtomItems } = useGetOtomItemsForUser();

  async function handleCraftItem() {
    try {
      toast.info('Please confirm the transaction in your wallet.');
      await writeContractAsync({
        address: assemblyCore[config.chainId],
        args: [item.id, BigInt(1), [], []],
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
    <Button disabled={disabled} onClick={handleCraftItem} className={className}>
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
          <ItemTraits traits={item.initialTraits} />
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
