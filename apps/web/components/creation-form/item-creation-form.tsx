'use client';

import {
  BlueprintComponentInput,
  BlueprintComponentsEditor,
  FormItemType,
  FungibleItemDetailsForm,
  FungibleItemFormData,
  ItemTraitsEditor,
  ItemTypeSelector,
  NavigationButtons,
  StepIndicator,
} from '@/components/creation-form/steps';
import { ItemTrait } from '@/components/creation-form/traits-editor';
import { Card, CardContent } from '@/components/ui/card';
import { itemCreationBannerDismissedAtom } from '@/lib/atoms';
import { paths } from '@/lib/paths';
import { ComponentType, ItemType, Trait } from '@/lib/types';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { XIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { FC, useState } from 'react';
import { Address, parseEther, zeroAddress } from 'viem';

type FungibleItemFormDataToSubmit = {
  itemType: ItemType;
  name: string;
  description: string;
  imageUri: string;
  costInWei: bigint;
  feeRecipient: Address;
  blueprintComponents: {
    componentType: ComponentType;
    itemIdOrOtomTokenId: bigint;
    amount: number;
  }[];
  traits: Trait[];
};

const defaultFungibleItemData: FungibleItemFormData = {
  name: '',
  description: '',
  imageUri: '',
  costInEth: '0',
  feeRecipient: zeroAddress,
  blueprintComponents: [],
  traits: [],
};

export const ItemCreationForm: FC = () => {
  const [step, setStep] = useQueryState('step', {
    defaultValue: 1,
    parse: (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? 1 : parsed;
    },
    serialize: (value) => value.toString(),
  });

  const [type, setType] = useState<FormItemType | ''>('');
  const [formData, setFormData] = useState<FungibleItemFormData>(defaultFungibleItemData);

  function handleSelectItemType(selectedType: FormItemType) {
    setType(selectedType);
    setStep(2);
  }

  function handleFungibleItemInputChange(field: keyof FungibleItemFormData, value: string) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function handleBlueprintComponentsChange(components: BlueprintComponentInput[]) {
    setFormData({
      ...formData,
      blueprintComponents: components,
    });
  }

  function handleTraitsChange(traits: ItemTrait[]) {
    setFormData({
      ...formData,
      traits,
    });
  }

  function handlePrevStep() {
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);

      if (newStep === 1) {
        setType('');
      }
    }
  }

  function handleNextStep() {
    if (step < 4) {
      setStep(step + 1);
    }
  }

  function isCurrentStepValid() {
    if (step === 1) return !!type;
    if (step === 2 && type === 'fungible') {
      return !!formData.name && !!formData.description && !!formData.imageUri;
    }
    if (step === 3) {
      return formData.blueprintComponents.length > 0;
    }
    return true;
  }

  function handleSubmit() {
    // Convert form data to contract-compatible format
    const contractItemType = type ? formItemTypeToItemType(type) : 0;

    // Convert string IDs to bigint for contract call
    const blueprintComponents = formData.blueprintComponents.map((component) => ({
      ...component,
      itemIdOrOtomTokenId: component.itemIdOrOtomTokenId
        ? BigInt(component.itemIdOrOtomTokenId)
        : BigInt(0),
    }));

    // Convert form traits to contract Trait format
    const traits: Trait[] = formData.traits.map((trait) => ({
      name: trait.typeName,
      value: trait.traitType === 'NUMBER' ? Number(trait.valueNumber) : trait.valueString,
    }));

    const formDataToSubmit: FungibleItemFormDataToSubmit = {
      itemType: contractItemType,
      name: formData.name,
      description: formData.description,
      imageUri: formData.imageUri,
      costInWei: formData.costInEth ? parseEther(formData.costInEth) : 0n,
      feeRecipient: formData.feeRecipient as Address,
      blueprintComponents,
      traits,
    };

    console.log('Form submitted', formDataToSubmit);

    // TODO: Implement contract interaction for createFungibleItem
  }

  function renderCurrentStep() {
    switch (step) {
      case 1:
        return <ItemTypeSelector selectedType={type || null} onSelect={handleSelectItemType} />;
      case 2:
        if (type === 'fungible') {
          return (
            <Card className="mx-auto w-3xl">
              <CardContent>
                <FungibleItemDetailsForm
                  formData={formData}
                  onChange={handleFungibleItemInputChange}
                />
                <NavigationButtons
                  currentStep={step}
                  totalSteps={4}
                  onPrevious={handlePrevStep}
                  onNext={handleNextStep}
                  onSubmit={handleSubmit}
                  isNextDisabled={!isCurrentStepValid()}
                />
              </CardContent>
            </Card>
          );
        }
        // Add non-fungible item form here in the future
        return null;
      case 3:
        return (
          <Card className="mx-auto w-3xl">
            <CardContent>
              <BlueprintComponentsEditor
                components={formData.blueprintComponents}
                onChange={handleBlueprintComponentsChange}
              />
              <NavigationButtons
                currentStep={step}
                totalSteps={4}
                onPrevious={handlePrevStep}
                onNext={handleNextStep}
                onSubmit={handleSubmit}
                isNextDisabled={!isCurrentStepValid()}
              />
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="mx-auto w-3xl">
            <CardContent>
              <ItemTraitsEditor traits={formData.traits} onChange={handleTraitsChange} />
              <NavigationButtons
                currentStep={step}
                totalSteps={4}
                onPrevious={handlePrevStep}
                onNext={handleNextStep}
                onSubmit={handleSubmit}
                isNextDisabled={!isCurrentStepValid()}
              />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  }

  const [bannerDismissed, setBannerDismissed] = useAtom(itemCreationBannerDismissedAtom);

  return (
    <div className="relative mt-64 flex flex-col gap-4">
      <div className="fixed inset-x-0 top-0 z-10 flex flex-col items-center justify-between gap-16 p-4">
        <div className="mx-auto w-full max-w-md">
          <StepIndicator currentStep={step} totalSteps={4} />
        </div>

        {step === 1 && (
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-2">
            <h1 className="text-2xl font-medium">New Assembly Item</h1>
            <h2 className="text-muted-foreground text-center text-pretty">
              Create an item to be used in the Assembly system and more
            </h2>
          </div>
        )}
      </div>

      {renderCurrentStep()}

      {step === 1 && (
        <div className="absolute inset-x-0 -bottom-20 mx-auto max-w-3xl rounded px-4 py-2">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm text-pretty italic">
              Item creation is only available on Shape Sepolia Testnet for now, we will roll it out
              to Shape Mainnet very soon. Stay tuned!
            </p>
          </div>
        </div>
      )}

      {!bannerDismissed && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 transition-transform hover:scale-x-[100.5%] sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
          <div className="pointer-events-auto flex items-center justify-between gap-x-6 rounded-4xl bg-gray-900 px-6 py-2.5 sm:py-3 sm:pr-3.5 sm:pl-4">
            <a
              className="text-sm text-white"
              href={paths.docs.itemCreation}
              target="_blank"
              rel="noreferrer"
            >
              Builder, looking for a more flexible and detailed guide to create an item? Check out
              the <strong className="font-bold">Assembly Item Creation Guide</strong>{' '}
            </a>

            <button
              type="button"
              className="-m-1.5 flex-none cursor-pointer p-1.5"
              onClick={() => setBannerDismissed(true)}
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="size-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function formItemTypeToItemType(type: FormItemType): ItemType {
  return type === 'fungible' ? 0 : 1;
}
