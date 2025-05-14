import { useGetItemsForUser, useGetOtomItemsForUser } from '@/app/api/hooks';
import {
  HorizontallScrollWrapper,
  InventorySkeleton,
  ItemsToCraftSkeleton,
  OtomItemCard,
  OwnedItemCard,
} from '@/components/items';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isOtomAtom } from '@/lib/otoms';
import { paths } from '@/lib/paths';
import type { OtomItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useDeferredValue, useEffect, useMemo, useState, type FC } from 'react';
import { useInView } from 'react-intersection-observer';

type GroupedOtomItems = {
  representativeItem: OtomItem;
  count: number;
  allItems: OtomItem[];
};

export const OtomsInventory: FC<{ usedRequiredItems: Set<string> }> = ({ usedRequiredItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const [moleculesRef, moleculesInView] = useInView();
  const [otomsRef, otomsInView] = useInView();

  const [bottomSentinelRef, isBottomSentinelInView] = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useGetOtomItemsForUser();

  useEffect(() => {
    if ((moleculesInView || otomsInView) && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [moleculesInView, otomsInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const inventory = useMemo(() => {
    const allItems = data?.pages.flatMap((page) => page.items) || [];
    const filteredItems = allItems.filter((item) =>
      item.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );

    const molecules = filteredItems.filter((item) => !isOtomAtom(item));
    const otoms = filteredItems.filter((item) => isOtomAtom(item));

    const groupItems = (items: OtomItem[]): GroupedOtomItems[] => {
      const groups = new Map<string, GroupedOtomItems>();
      for (const item of items) {
        if (groups.has(item.tokenId)) {
          const group = groups.get(item.tokenId)!;
          group.count++;
          group.allItems.push(item);
        } else {
          groups.set(item.tokenId, {
            representativeItem: item,
            count: 1,
            allItems: [item],
          });
        }
      }
      return Array.from(groups.values()).sort((a, b) =>
        a.representativeItem.name.localeCompare(b.representativeItem.name)
      );
    };

    return {
      molecules: groupItems(molecules),
      otoms: groupItems(otoms),
    };
  }, [data?.pages, deferredSearchTerm]);

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  const isInventoryEmpty =
    !inventory || (inventory.otoms.length === 0 && inventory.molecules.length === 0);

  return (
    <div className="flex flex-col gap-4">
      {!deferredSearchTerm && isInventoryEmpty && (
        <div className="grid place-items-center gap-4 py-12">
          <p>No otoms found in your wallet.</p>
          <Button asChild>
            <a href={paths.otom} target="_blank" rel="noopener noreferrer">
              Get otoms
            </a>
          </Button>
        </div>
      )}

      <ScrollArea className="relative h-full max-h-[50vh] flex-col sm:max-h-[36vh]">
        <p className="text-muted-foreground mb-4 text-sm italic">
          Drag elements into the desired slot to craft an item.
        </p>

        <Input
          type="search"
          placeholder="Search owned otoms (eg Ju)"
          className="mb-4 max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isInventoryEmpty}
        />

        {inventory.molecules.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground text-sm">Molecules</h3>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] items-start gap-2 rounded sm:flex sm:flex-wrap">
              {inventory.molecules.map((group) => (
                <OtomItemCard
                  key={group.representativeItem.tokenId}
                  representativeItem={group.representativeItem}
                  count={group.count}
                  allItems={group.allItems}
                  usedTokenIds={usedRequiredItems}
                />
              ))}
            </ul>
            <div ref={moleculesRef}>{isFetchingNextPage && 'Loading more...'}</div>
          </div>
        )}

        {inventory.otoms.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <h3 className="text-muted-foreground text-sm">Otoms</h3>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] items-start gap-2 rounded sm:flex sm:flex-wrap">
              {inventory.otoms.map((group) => (
                <OtomItemCard
                  key={group.representativeItem.tokenId}
                  representativeItem={group.representativeItem}
                  count={group.count}
                  allItems={group.allItems}
                  usedTokenIds={usedRequiredItems}
                />
              ))}
            </ul>
            <div ref={otomsRef}>{isFetchingNextPage && 'Loading more...'}</div>
          </div>
        )}

        {deferredSearchTerm && isInventoryEmpty && (
          <p className="text-muted-foreground py-4 text-sm">{`No otoms found matching "${deferredSearchTerm}".`}</p>
        )}

        <div ref={bottomSentinelRef} className="h-px" />

        <div
          className={cn(
            'from-background via-background/50 absolute inset-x-0 bottom-0 h-4 w-full bg-gradient-to-t to-transparent transition-opacity',
            isBottomSentinelInView ? 'opacity-0' : 'opacity-100'
          )}
        />
      </ScrollArea>
    </div>
  );
};

export const ItemsInventory: FC = () => {
  const { data, isLoading, isError } = useGetItemsForUser();

  if (isLoading) {
    return <ItemsToCraftSkeleton />;
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
    <HorizontallScrollWrapper>
      {data.map((item) => (
        <OwnedItemCard key={item.id} item={item} />
      ))}
    </HorizontallScrollWrapper>
  );
};
