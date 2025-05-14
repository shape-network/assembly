'use client';

import { wagmiConfig } from '@/lib/web3';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { ReactNode, Suspense, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AnalyticsProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AnalyticsProvider>
  );
};

// if (typeof window !== 'undefined') {
//   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
//     capture_pageview: false,
//     capture_pageleave: true, // Enable pageleave capture
//     loaded: (posthog) => {
//       if (process.env.NODE_ENV === 'development') posthog.debug();
//     },
//   });
// }
// export const CSPostHogProvider = ({ children }: PropsWithChildren) => {
//   return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
// };

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PostHogProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }

      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
