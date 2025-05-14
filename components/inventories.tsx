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
import { paths } from '@/lib/paths';
import type { OtomItem } from '@/lib/types';
import { useDeferredValue, useMemo, useState, type FC } from 'react';

type GroupedOtomItems = {
  representativeItem: OtomItem;
  count: number;
  allItems: OtomItem[];
};

export const OtomsInventory: FC<{ usedRequiredItems: Set<string> }> = ({ usedRequiredItems }) => {
  const { data: rawInventory, isLoading, isError } = useGetOtomItemsForUser();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const groupedInventory = useMemo(() => {
    if (!rawInventory) return [];

    const filteredInventory = rawInventory.filter((item) =>
      item.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
    const groups = new Map<string, GroupedOtomItems>();
    for (const item of filteredInventory) {
      if (groups.has(item.tokenId)) {
        const group = groups.get(item.tokenId);
        if (group) {
          group.count++;
          group.allItems.push(item);
        }
      } else {
        groups.set(item.tokenId, {
          representativeItem: item,
          count: 1,
          allItems: [item],
        });
      }
    }
    return Array.from(groups.values());
  }, [rawInventory, deferredSearchTerm]);

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {(!rawInventory || rawInventory.length === 0) && (
        <div className="grid place-items-center gap-4 py-12">
          <p>No otoms found in your wallet.</p>
          <Button asChild>
            <a href={paths.otom} target="_blank" rel="noopener noreferrer">
              Get otoms
            </a>
          </Button>
        </div>
      )}

      <ScrollArea className="h-full max-h-[50vh] flex-col sm:max-h-[36vh]">
        <p className="text-muted-foreground mb-4 text-sm italic">
          Drag elements into the desired slot to craft an item.
        </p>

        <Input
          type="search"
          placeholder="Search owned otoms (eg Ju)"
          className="mb-4 max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!rawInventory || rawInventory.length === 0}
        />

        {groupedInventory.length > 0 ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] items-start gap-2 rounded sm:flex sm:flex-wrap">
            {groupedInventory.map((group) => (
              <OtomItemCard
                key={group.representativeItem.tokenId}
                representativeItem={group.representativeItem}
                count={group.count}
                allItems={group.allItems}
                usedTokenIds={usedRequiredItems}
              />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground py-4 text-sm">{`No otoms found matching "${deferredSearchTerm}".`}</p>
        )}
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
