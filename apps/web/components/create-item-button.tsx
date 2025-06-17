'use client';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { FC } from 'react';
import { useAccount } from 'wagmi';

export const CreateItemButton: FC = () => {
  const { address } = useAccount();
  const router = useRouter();
  const posthog = usePostHog();

  const onCreationClick = () => {
    router.push(paths.create);
    posthog?.capture('click', { event: 'click_navbar', action: 'create_item' });
  };

  if (!address) return null;

  return (
    <div className="flex items-center gap-1">
      <Button size="lg" onClick={onCreationClick}>
        Create Assembly Item
      </Button>
    </div>
  );
};
