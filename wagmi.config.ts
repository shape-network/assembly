import itemsCoreAbi from '@/abi/ItemsCore.json';
import otomsCoreAbi from '@/abi/OtomsCore.json';
import otomsDatabaseAbi from '@/abi/OtomsDatabase.json';
import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { Abi } from 'viem';

export default defineConfig({
  out: 'generated.ts',
  contracts: [
    {
      name: 'OtomsCoreContract',
      abi: otomsCoreAbi.abi as Abi,
    },
    {
      name: 'OtomsDatabaseContract',
      abi: otomsDatabaseAbi.abi as Abi,
    },
    {
      name: 'ItemsCoreContract',
      abi: itemsCoreAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
