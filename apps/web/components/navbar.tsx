'use client';

import { FloatingInventory, useFloatingInventory } from '@/components/floating-inventory';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { itemCreationBannerDismissedAtom, onboardingCompletedAtom } from '@/lib/atoms';
import { config } from '@/lib/config';
import { paths } from '@/lib/paths';
import { cn } from '@/lib/utils';
import { useAtom, useAtomValue } from 'jotai/react';
import { BackpackIcon, HelpCircle, PencilRulerIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { FC } from 'react';
import { useAccount } from 'wagmi';
import { OnboardingWizard } from './onboarding-wizard';

interface GameMenuProps {
  className?: string;
}

export const Navbar: FC<GameMenuProps> = ({ className }) => {
  const { isFloating, handleOpenFloating, handleCloseFloating } = useFloatingInventory();
  const pathname = usePathname();
  const [onboardingCompleted, setOnboardingCompleted] = useAtom(onboardingCompletedAtom);
  const bannerDismissed = useAtomValue(itemCreationBannerDismissedAtom);
  const { address } = useAccount();
  const router = useRouter();
  const posthog = usePostHog();

  const toggleInventory = () => {
    if (isFloating) {
      handleCloseFloating();
    } else {
      handleOpenFloating();
    }
  };

  const onCreationClick = () => {
    router.push(paths.create);
    handleCloseFloating();
    posthog?.capture('click', { event: 'click_navbar', action: 'create_item' });
  };

  if (!address) return null;

  return (
    <>
      <div
        className={cn(
          'bg-card/95 fixed right-8 bottom-8 z-40 rounded-lg border p-1 shadow-lg backdrop-blur-sm',
          !bannerDismissed && pathname === paths.create && 'bottom-24',
          className
        )}
      >
        <div className="flex items-center gap-1">
          <MenuButton
            icon={<BackpackIcon className="size-5" />}
            tooltip={isFloating ? 'Close Inventory' : 'Open Inventory'}
            isActive={isFloating === true}
            onClick={toggleInventory}
          />
          {config.chain.testnet && (
            <MenuButton
              icon={<PencilRulerIcon className="size-5" />}
              tooltip="Create an item"
              isActive={pathname === paths.create}
              onClick={onCreationClick}
            />
          )}
          <MenuButton
            icon={<HelpCircle className="size-5" />}
            tooltip="Help"
            onClick={() => {
              setOnboardingCompleted(false);
              posthog?.capture('click', { event: 'click_navbar', action: 'help' });
            }}
          />
        </div>
        <OnboardingWizard
          open={!!address && !onboardingCompleted}
          onOpenChange={(open) => setOnboardingCompleted(!open)}
        />
      </div>
      {pathname !== '/' && <FloatingInventory />}
    </>
  );
};

interface MenuButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  isActive?: boolean;
}

const MenuButton: FC<MenuButtonProps> = ({ icon, tooltip, onClick, isActive = false }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          size="icon"
          className={cn(
            'size-10 rounded-lg transition-all',
            isActive && 'bg-primary text-primary-foreground'
          )}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
};
