import { BlueprintEditor } from '@/components/creation-form/blueprint-editor';
import { ItemTrait, TraitsEditor } from '@/components/creation-form/traits-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentType, Criteria } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { FC } from 'react';

export type FormItemType = 'fungible' | 'non-fungible';

type ItemTypeSelectorProps = {
  selectedType: FormItemType | null;
  onSelect: (type: FormItemType) => void;
};

export const ItemTypeSelector: FC<ItemTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="mt-6 grid max-w-4xl grid-cols-2 gap-4">
      <button onClick={() => onSelect('fungible')} type="button" className="cursor-pointer">
        <Card
          className={cn(
            'hover:border-primary border-border h-full transition-colors',
            selectedType === 'fungible' && 'border-primary'
          )}
        >
          <CardContent className="py-8">
            <div className="text-center">
              <h4 className="mb-2 text-lg font-medium">Fungible Item</h4>
              <p className="text-muted-foreground text-sm">
                Standard fungible tokens that stack in inventory, useful for resources or
                consumables that all have identical properties at all times
              </p>
              <p className="text-muted-foreground mt-2 text-xs">(e.g., resources, consumables)</p>
            </div>
          </CardContent>
        </Card>
      </button>

      <button onClick={() => onSelect('non-fungible')} type="button" disabled className="relative">
        <Badge className="absolute top-2 right-2 z-10">Coming Soon</Badge>
        <Card className="cursor-not-allowed opacity-75">
          <CardContent className="py-8">
            <div className="text-center">
              <h4 className="mb-2 text-lg font-medium">Non-Fungible Item</h4>
              <p className="text-muted-foreground text-sm">
                Unique items that can have tiers and dynamic properties, suitable for equipment or
                collectibles where each instance of an item could have different properties at any
                given time
              </p>
              <p className="text-muted-foreground mt-2 text-xs">(e.g., equipment, collectibles)</p>
            </div>
          </CardContent>
        </Card>
      </button>
    </div>
  );
};

export type BlueprintComponentInput = {
  componentType: ComponentType;
  itemIdOrOtomTokenId: string;
  amount: number;
  criteria: Criteria[];
};

export type FungibleItemFormData = {
  name: string;
  description: string;
  imageUri: string;
  costInEth: string;
  feeRecipient: string;
  blueprintComponents: BlueprintComponentInput[];
  traits: ItemTrait[];
};

type FungibleItemDetailsFormProps = {
  formData: {
    name: string;
    description: string;
    imageUri: string;
    costInEth: string;
    feeRecipient: string;
  };
  onChange: (field: keyof FungibleItemFormData, value: string) => void;
};

export const FungibleItemDetailsForm: FC<FungibleItemDetailsFormProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fungible Item Details</h3>

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
          <Label htmlFor="costInEth">Cost (in ETH)</Label>
          <Input
            id="costInEth"
            type="number"
            step="0.0001"
            placeholder="0"
            value={formData.costInEth}
            onChange={(e) => onChange('costInEth', e.target.value)}
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

export const BlueprintComponentsEditor: FC<BlueprintComponentsEditorProps> = ({
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

export const ItemTraitsEditor: FC<ItemTraitsEditorProps> = ({ traits, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Item Traits</h3>
      <p className="text-muted-foreground">Define optional traits for your item</p>

      <TraitsEditor traits={traits} onChange={onChange} />
    </div>
  );
};

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export const StepIndicator: FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
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

type NavigationButtonsProps = {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isNextDisabled: boolean;
};

export const NavigationButtons: FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isNextDisabled,
}) => {
  return (
    <div className="mt-4 flex justify-between">
      <Button variant="ghost" onClick={onPrevious} size="sm">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      {currentStep < totalSteps ? (
        <Button variant="ghost" onClick={onNext} disabled={isNextDisabled} size="sm">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={onSubmit}>
          Create Item
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
