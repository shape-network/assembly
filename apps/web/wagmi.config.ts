import assemblyCoreAbi from '@/abi/AssemblyCore.json';
import assemblyItemsAbi from '@/abi/AssemblyItems.json';
import assemblyTrackingAbi from '@/abi/AssemblyTracking.json';
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
      name: 'AssemblyCoreContract',
      abi: assemblyCoreAbi.abi.filter(
        (item) => !(item.type === 'function' && item.name?.startsWith('_'))
      ) as Abi,
    },
    {
      name: 'AssemblyTrackingContract',
      abi: assemblyTrackingAbi.abi as Abi,
    },
    {
      name: 'AssemblyItemsContract',
      abi: assemblyItemsAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
