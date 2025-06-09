import otomItemsAbi from '@/abi/OtomItems.json';
import otomItemsCoreAbi from '@/abi/OtomItemsCore.json';
import otomItemsTrackingAbi from '@/abi/OtomItemsTracking.json';
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
      name: 'OtomItemsCoreContract',
      abi: otomItemsCoreAbi.abi.filter(
        (item) => !(item.type === 'function' && item.name?.startsWith('_'))
      ) as Abi,
    },
    {
      name: 'OtomItemsTrackingContract',
      abi: otomItemsTrackingAbi.abi as Abi,
    },
    {
      name: 'OtomItemsContract',
      abi: otomItemsAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
