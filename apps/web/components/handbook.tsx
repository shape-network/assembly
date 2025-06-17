'use client';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { CSSProperties, FC, ReactNode, useState } from 'react';

export const AssemblyHandbook: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="sm">
          <span className="hidden md:block">Creation Handbook</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        style={
          {
            '--initial-transform': 'calc(100% + 0.5rem)',
            maxWidth: '500px',
            width: '100%',
          } as CSSProperties
        }
      >
        <aside className="flex h-full flex-col gap-4 bg-white">
          <button
            type="button"
            className="absolute top-4 right-4 z-10"
            onClick={() => setIsOpen(false)}
          >
            <ChevronRightIcon className="text-accent size-6" />
          </button>

          <DrawerHeader>
            <DrawerTitle>How to create an item in Assembly</DrawerTitle>
            <DrawerDescription>A practical guide for crafters & builders</DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="flex flex-col gap-16 p-5">
              <Section>
                <ol className="list-decimal space-y-4 pl-5">
                  <li>
                    Decide if you’d like to make it fungible (this means all the items will have the
                    same stats), or non-fungible (this means that each item is unique, and enables
                    the posibility of tiered items*)
                  </li>
                  <li>
                    Pick a name for your item
                    <ol className="mt-2 list-[lower-alpha] pl-5">
                      <li>This is the name that shows up on the NFT</li>
                    </ol>
                  </li>
                  <li>
                    Give it a good description
                    <ol className="mt-2 list-[lower-alpha] pl-5">
                      <li>This will also show up on the NFT</li>
                    </ol>
                  </li>
                  <li>
                    Make an image for your item
                    <ol className="mt-2 list-[lower-alpha] pl-5">
                      <li>
                        The image shows up on the Assembly website, but it won’t show up on places
                        where you normally view NFTs
                      </li>
                    </ol>
                  </li>
                  <li>
                    Decide on a good cost for crafting this item
                    <ol className="mt-2 list-[lower-alpha] pl-5">
                      <li>
                        Leave it at zero, or make high as you want. The fee will be directly
                        deposited into the address you’ve set
                      </li>
                      <li>
                        If you added a fee, make sure to set the fee recipient address. This can be
                        your personal address, or use a platform like{' '}
                        <a
                          href="https://splits.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          splits
                        </a>{' '}
                        to split the fee between multiple addresses
                      </li>
                    </ol>
                  </li>
                  <li>
                    Construct the perfect blueprint
                    <ol className="mt-2 list-[lower-alpha] pl-5">
                      <li>
                        <b>Otom:</b> good if you already have an idea of what otoms you’d like to
                        use
                      </li>
                      <li>
                        <b>Variable Otom:</b> this lets the crafter use any otom that meets your
                        specified criteria
                      </li>
                      <li>
                        <b>Assembly Fungible Item & Assembly Non-Fungible Item:</b> lets you specify
                        other Assembly items to be used when crafting your item
                      </li>
                    </ol>
                  </li>
                  <li>
                    Give the items some traits
                    <ol className="mt-2 list-[lower-alpha] pl-5">
                      <li>This could be a item stat or just useful information about the item</li>
                      <li>
                        These traits will show up as attributes on the NFT where ever you view it
                      </li>
                      <li>
                        This means that someone could filter the Assembly Item collection for a
                        particular trait on{' '}
                        <a
                          href="https://opensea.io/collection/assembly-items"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          opensea
                        </a>{' '}
                        and find items with that trait
                      </li>
                    </ol>
                  </li>
                </ol>
              </Section>
            </div>
          </ScrollArea>
        </aside>
      </DrawerContent>
    </Drawer>
  );
};

const Section: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-5">{children}</div>
);
