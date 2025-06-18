'use client';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';
import { PencilRulerIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { FC } from 'react';
import { useAccount } from 'wagmi';
import { useMediaQuery } from './hooks/useMediaQuery';

export const CreateItemButton: FC = () => {
  const { address } = useAccount();
  const router = useRouter();
  const posthog = usePostHog();

  const onCreationClick = () => {
    router.push(paths.create);
    posthog?.capture('click', { event: 'click_navbar', action: 'create_item' });
  };
  const isMobile = useMediaQuery('sm');

  if (!address) return null;

  return (
    <div className="flex items-center gap-1">
      <Button size={isMobile ? 'icon' : 'lg'} onClick={onCreationClick}>
        {isMobile ? <PencilRulerIcon className="size-5" /> : 'Create Assembly Item'}
      </Button>
    </div>
  );
};
