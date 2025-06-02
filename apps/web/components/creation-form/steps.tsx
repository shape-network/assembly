import { BlueprintEditor } from '@/components/creation-form/blueprint-editor';
import { FormItemType } from '@/components/creation-form/schema';
import { ItemTrait, TraitsEditor } from '@/components/creation-form/traits-editor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentType, Criteria } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { ArrowRight, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { FC } from 'react';
import { Address } from 'viem';
import { InlineLink } from '../ui/link';

type ItemTypeSelectorProps = {
  selectedType: FormItemType | null;
  onSelect: (type: FormItemType) => void;
};

export const ItemTypeSelector: FC<ItemTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="mt-6 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
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

      <button onClick={() => onSelect('non-fungible')} type="button" className="cursor-pointer">
        <Card
          className={cn(
            'hover:border-primary border-border h-full transition-colors',
            selectedType === 'non-fungible' && 'border-primary'
          )}
        >
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

type FormDetails = {
  name: string;
  description: string;
  imageUri: string;
  costInEth: string;
  feeRecipient: Address;
};

export type FungibleItemFormData = FormDetails & {
  blueprintComponents: BlueprintComponentInput[];
  traits: ItemTrait[];
};

export type NonFungibleItemFormData = FormDetails & {
  tieredImageUris: string[];
  mutatorContract: string;
  blueprintComponents: BlueprintComponentInput[];
  traits: ItemTrait[];
};

type FungibleItemDetailsFormProps = {
  formData: FormDetails;
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
        {formData.costInEth !== '0' && (
          <div className="grid gap-2">
            <Label htmlFor="feeRecipient">Fee Recipient Address</Label>
            <Input
              id="feeRecipient"
              placeholder="0x0000000000000000000000000000000000000000"
              value={formData.feeRecipient}
              onChange={(e) => onChange('feeRecipient', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

type NonFungibleItemDetailsFormProps = {
  formData: NonFungibleItemFormData;
  onChange: (field: keyof NonFungibleItemFormData, value: string | string[] | boolean) => void;
};

export const NonFungibleItemDetailsForm: FC<NonFungibleItemDetailsFormProps> = ({
  formData,
  onChange,
}) => {
  const handleTierImageChange = (index: number, value: string) => {
    const newTieredImageUris = [...formData.tieredImageUris];
    newTieredImageUris[index] = value;
    onChange('tieredImageUris', newTieredImageUris);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Non-Fungible Item Details</h3>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g., Enchanted Sword"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g., A powerful weapon with dynamic properties"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="imageUri">Default Image URI</Label>
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
          <Label htmlFor="feeRecipient">Fee Recipient Address (leave blank if no cost)</Label>
          <Input
            id="feeRecipient"
            placeholder="0x0000000000000000000000000000000000000000"
            value={formData.feeRecipient}
            onChange={(e) => onChange('feeRecipient', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="mutatorContract">Mutator Contract Address (Required)</Label>
          <Input
            id="mutatorContract"
            placeholder="0x0000000000000000000000000000000000000000"
            value={formData.mutatorContract}
            onChange={(e) => onChange('mutatorContract', e.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            Required for tiered items. Your mutator contract must implement tier calculation logic
            (calculateTier function) to determine item tiers based on crafting components and cost.
          </p>

          <Accordion type="single" collapsible>
            <AccordionItem value="tiers">
              <AccordionTrigger className="-mt-1 mb-1 py-2 text-xs text-black/60 underline">
                How to define Tiers for your Item (T1-T7)?
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-2">
                <p className="text-muted-foreground text-sm">
                  Create a tiered item where different instances can have different power levels
                  (T1-T7). Tiers are calculated by your mutator contract during crafting based on
                  the components used.
                </p>

                <div className="space-y-2">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Mutator Contract Requirements</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">
                        Your mutator contract must implement the IOtomItemMutator interface with
                        these functions:
                      </p>
                      <ul className="ml-4 list-disc space-y-1">
                        <li>
                          <code>calculateTier()</code> - Determines tier (1-7) based on components
                          and cost
                        </li>
                        <li>
                          <code>onCraft()</code> - Called when item is crafted (optional custom
                          logic)
                        </li>
                        <li>
                          <code>onItemUse()</code> - Called when item is used (optional custom
                          logic)
                        </li>
                        <li>
                          <code>onTransfer()</code> - Called on transfers (optional restrictions)
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  <p className="text-muted-foreground text-sm">
                    Here is the{' '}
                    <InlineLink href="https://github.com/shape-network/assembly/blob/main/packages/contracts/contracts/interfaces/IOtomItemMutator.sol">
                      interface <ExternalLinkIcon className="size-4" />
                    </InlineLink>{' '}
                    you will need, and here is an example of a{' '}
                    <InlineLink href="https://github.com/shape-network/assembly/blob/main/packages/contracts/contracts/items/mutators/GenericMutator.sol">
                      generic mutator <ExternalLinkIcon className="size-4" />
                    </InlineLink>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="tierImages">
              <Label asChild>
                <AccordionTrigger className="-mt-1 mb-1 py-2">
                  Tier Image URIs (Optional)
                </AccordionTrigger>
              </Label>
              <AccordionContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Provide custom images for each tier (T1-T7). Leave empty to use default onchain
                  SVG rendering.
                </p>
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="grid gap-1">
                    <Label htmlFor={`tier-${index + 1}`} className="text-sm">
                      Tier {index + 1} Image URI
                    </Label>
                    <Input
                      id={`tier-${index + 1}`}
                      placeholder={`https://example.com/tier${index + 1}.png`}
                      value={formData.tieredImageUris[index] || ''}
                      onChange={(e) => handleTierImageChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
  setStep: (step: number) => void;
};

export const StepIndicator: FC<StepIndicatorProps> = ({ currentStep, totalSteps, setStep }) => {
  return (
    <div className="bg-background flex justify-between rounded-full px-8 py-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        return (
          <div
            key={step}
            className={cn('flex flex-col items-center', currentStep >= step && 'cursor-pointer')}
            onClick={() => currentStep >= step && setStep(step)}
          >
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
        <Button onClick={onSubmit} disabled={isNextDisabled}>
          Create Item
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
