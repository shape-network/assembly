import { WalletConnect } from '@/components/wallet-connect';

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-primary text-4xl font-bold">ASSEMBLY</h1>
        <p className="text-xl">An otom-based item crafter</p>
        <WalletConnect />
      </main>
    </div>
  );
}
