'use client';

import { BlueprintEditor } from '@/components/blueprint-editor';
import { ItemTrait, TraitsEditor } from '@/components/traits-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentType, Criteria, ItemType, Trait } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Item</CardTitle>
        <CardDescription>Create a new item to be used in the Assembly system</CardDescription>
      </CardHeader>

      <CardContent>
        <StepIndicator currentStep={step} totalSteps={4} />

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

// Step 2: Item Details Form
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

// Step 3: Blueprint Components Editor
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

// Step 4: Item Traits Editor
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
    <div className="mb-8 flex justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        return (
          <div key={step} className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border',
                currentStep === step
                  ? 'bg-primary text-primary-foreground border-primary'
                  : currentStep > step
                    ? 'bg-primary/20 text-primary border-primary/20'
                    : 'bg-muted text-muted-foreground border-input'
              )}
            >
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            <span
              className={cn(
                'mt-2 text-xs',
                currentStep === step ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {step === 1 ? 'Type' : step === 2 ? 'Details' : step === 3 ? 'Blueprint' : 'Traits'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

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
    <div className="mt-8 flex justify-between">
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
