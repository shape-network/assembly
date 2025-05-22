'use client';

import { BlueprintEditor } from '@/components/blueprint-editor';
import { ItemTrait, TraitsEditor } from '@/components/traits-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { itemCreationBannerDismissedAtom } from '@/lib/atoms';
import { paths } from '@/lib/paths';
import { ComponentType, Criteria, ItemType, Trait } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { ArrowRight, ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { FC } from 'react';

export const ItemCreationForm: FC = () => {
  const [step, setStep] = useQueryState('step', {
    defaultValue: 1,
    parse: (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? 1 : parsed;
    },
    serialize: (value) => value.toString(),
  });

  const [type, setType] = useQueryState('type', {
    defaultValue: '' as FormItemType,
    parse: (value) => {
      return value === 'fungible' || value === 'non-fungible' ? (value as FormItemType) : '';
    },
    serialize: (value) => value,
  });

  const [formData, setFormData] = useQueryState('formData', {
    defaultValue: defaultFungibleItemData,
    parse: (value) => {
      try {
        return JSON.parse(value) as FungibleItemFormData;
      } catch {
        return defaultFungibleItemData;
      }
    },
    serialize: (value) => JSON.stringify(value),
  });

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
      setStep(step - 1);
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

    console.log('Form submitted', {
      itemType: contractItemType,
      name: formData.name,
      description: formData.description,
      imageUri: formData.imageUri,
      costInWei: formData.costInWei ? BigInt(formData.costInWei) : BigInt(0),
      feeRecipient: formData.feeRecipient,
      blueprintComponents,
      traits,
    });

    // TODO: Implement contract interaction for createFungibleItem
  }

  function renderCurrentStep() {
    switch (step) {
      case 1:
        return <ItemTypeSelector selectedType={type || null} onSelect={handleSelectItemType} />;
      case 2:
        if (type === 'fungible') {
          return (
            <FungibleItemDetailsForm formData={formData} onChange={handleFungibleItemInputChange} />
          );
        }
        // Add non-fungible item form here in the future
        return null;
      case 3:
        return (
          <BlueprintComponentsEditor
            components={formData.blueprintComponents}
            onChange={handleBlueprintComponentsChange}
          />
        );
      case 4:
        return <ItemTraitsEditor traits={formData.traits} onChange={handleTraitsChange} />;
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

      <Card className="mx-auto w-3xl">
        <CardContent>
          {renderCurrentStep()}

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

      {step === 1 && (
        <div className="absolute -bottom-20 max-w-3xl rounded bg-white px-4 py-2">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm italic">
              Item creation is only available on Shape Sepolia Testnet for now, we will roll it out
              to Shape Mainnet very soon. Stay tuned!
            </p>
          </div>
        </div>
      )}

      {!bannerDismissed && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 transition-transform hover:scale-[101%] sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
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
              className="pointer-cursor -m-1.5 flex-none p-1.5"
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

type FormItemType = 'fungible' | 'non-fungible';

function formItemTypeToItemType(type: FormItemType): ItemType {
  return type === 'fungible' ? 0 : 1;
}

type BlueprintComponentInput = {
  componentType: ComponentType;
  itemIdOrOtomTokenId: string;
  amount: number;
  criteria: Criteria[];
};

type FungibleItemFormData = {
  name: string;
  description: string;
  imageUri: string;
  costInWei: string;
  feeRecipient: string;
  blueprintComponents: BlueprintComponentInput[];
  traits: ItemTrait[];
};

const defaultFungibleItemData: FungibleItemFormData = {
  name: '',
  description: '',
  imageUri: '',
  costInWei: '0',
  feeRecipient: '0x0000000000000000000000000000000000000000',
  blueprintComponents: [],
  traits: [],
};

type ItemTypeSelectorProps = {
  selectedType: FormItemType | null;
  onSelect: (type: FormItemType) => void;
};

const ItemTypeSelector: FC<ItemTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Item Type</h3>
      <p className="text-muted-foreground">
        Choose whether you want to create a fungible or non-fungible item
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card
          className={cn(
            'hover:border-primary cursor-pointer transition-colors',
            selectedType === 'fungible' && 'border-primary'
          )}
          onClick={() => onSelect('fungible')}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="mb-2 font-medium">Fungible Item</h4>
              <p className="text-muted-foreground text-sm">
                Standard, identical items that stack in inventory
              </p>
              <p className="text-muted-foreground mt-2 text-xs">(e.g., resources, consumables)</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'hover:border-primary cursor-pointer transition-colors',
            selectedType === 'non-fungible' && 'border-primary'
          )}
          onClick={() => onSelect('non-fungible')}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="mb-2 font-medium">Non-Fungible Item</h4>
              <p className="text-muted-foreground text-sm">
                Unique items with individual traits and tiers
              </p>
              <p className="text-muted-foreground mt-2 text-xs">(e.g., equipment, collectibles)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

type FungibleItemDetailsFormProps = {
  formData: {
    name: string;
    description: string;
    imageUri: string;
    costInWei: string;
    feeRecipient: string;
  };
  onChange: (field: keyof FungibleItemFormData, value: string) => void;
};

const FungibleItemDetailsForm: FC<FungibleItemDetailsFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fungible Item Details</h3>
      <p className="text-muted-foreground">Provide basic information about your fungible item</p>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g., Gold Ore"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g., A valuable resource used in crafting"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="imageUri">Image URI</Label>
          <Input
            id="imageUri"
            placeholder="e.g., https://example.com/image.png"
            value={formData.imageUri}
            onChange={(e) => onChange('imageUri', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="costInWei">Cost (in Wei)</Label>
          <Input
            id="costInWei"
            type="number"
            placeholder="0"
            value={formData.costInWei}
            onChange={(e) => onChange('costInWei', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="feeRecipient">Fee Recipient (address)</Label>
          <Input
            id="feeRecipient"
            placeholder="0x0000000000000000000000000000000000000000"
            value={formData.feeRecipient}
            onChange={(e) => onChange('feeRecipient', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

type BlueprintComponentsEditorProps = {
  components: BlueprintComponentInput[];
  onChange: (components: BlueprintComponentInput[]) => void;
};

const BlueprintComponentsEditor: FC<BlueprintComponentsEditorProps> = ({
  components,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Blueprint Components</h3>
      <p className="text-muted-foreground">Define the components required to craft this item</p>

      <BlueprintEditor components={components} onChange={onChange} />
    </div>
  );
};

type ItemTraitsEditorProps = {
  traits: ItemTrait[];
  onChange: (traits: ItemTrait[]) => void;
};

const ItemTraitsEditor: FC<ItemTraitsEditorProps> = ({ traits, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Item Traits</h3>
      <p className="text-muted-foreground">Define optional traits for your item</p>

      <TraitsEditor traits={traits} onChange={onChange} />
    </div>
  );
};

// Step Indicator Component
type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator: FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        return (
          <div key={step} className="flex flex-col items-center">
            <div
              className={cn(
                'flex',
                currentStep >= step ? 'text-primary' : 'text-muted-foreground/50'
              )}
            >
              {step}
            </div>
            <span
              className={cn(
                'mt-2 text-xs',
                currentStep >= step ? 'text-primary font-semibold' : 'text-muted-foreground/50'
              )}
            >
              {getStepLabel(step)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

function getStepLabel(step: number) {
  switch (step) {
    case 1:
      return 'Type';
    case 2:
      return 'Details';
    case 3:
      return 'Blueprint';
    case 4:
      return 'Traits';
    default:
      return 'n/a';
  }
}

// Navigation Component
type NavigationButtonsProps = {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isNextDisabled: boolean;
};

const NavigationButtons: FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isNextDisabled,
}) => {
  return (
    <div className="mt-4 flex justify-between">
      {currentStep > 1 ? (
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : (
        <div></div>
      )}

      {currentStep < totalSteps ? (
        <Button onClick={onNext} disabled={isNextDisabled}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={onSubmit}>
          Create Item
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
