import { WalletConnect } from '@/components/wallet-connect';

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20">
      <main className="flex flex-col gap-8">
        <h1 className="text-4xl font-bold">Assembly</h1>
        <p className="text-lg">An otom-based item crafter</p>
        <WalletConnect />
      </main>
    </div>
  );
}
