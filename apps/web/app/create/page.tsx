import { ItemCreationForm } from '@/components/creation-form/item-creation-form';
import { Suspense } from 'react';

export default function Create() {
  return (
    <main className="grid items-start justify-center pb-36">
      <Suspense fallback={<div>Loading...</div>}>
        <ItemCreationForm />
      </Suspense>
    </main>
  );
}
