'use client';

import { Button } from '@/components/ui/button';
import { config } from '@/lib/config';
import { abbreviateHash } from '@/lib/utils';
import { ExitIcon } from '@radix-ui/react-icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useEnsName } from 'wagmi';

export const WalletConnect = ({ label }: { label?: string }) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: config.chain.id });
  const { disconnect } = useDisconnect();

  function handleDisconnect() {
    disconnect();
  }

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, account }) =>
        account && address ? (
          <span className="flex items-center gap-x-2 font-medium">
            <span className="hidden md:block">{ensName ?? abbreviateHash(address)}</span>

            <button onClick={handleDisconnect} type="button" className="cursor-pointer">
              <ExitIcon className="size-4" />
            </button>
          </span>
        ) : (
          <Button onClick={openConnectModal}>{label ?? 'Connect Wallet'}</Button>
        )
      }
    </ConnectButton.Custom>
  );
};
