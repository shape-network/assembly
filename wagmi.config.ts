import otomsAbi from '@/abi/Otoms.json';
import otomsDatabaseAbi from '@/abi/OtomsDatabase.json';
import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { Abi } from 'viem';

export default defineConfig({
  out: 'generated.ts',
  contracts: [
    {
      name: 'OtomsContract',
      abi: otomsAbi.abi as Abi,
    },
    {
      name: 'OtomsDatabaseContract',
      abi: otomsDatabaseAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
