'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';
import { cn } from '@/lib/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';

type OnboardingStep = {
  title: string;
  description: string;
  content?: React.ReactNode;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Assembly!',
    description: 'A composable & community-driven item crafting system.',
    content: (
      <div className="flex flex-col gap-4">
        <p>
          Built on top of Otoms, every item you craft is minted as an ERC1155 token and stored
          permanently onchain.
        </p>
        <p>
          Items can be reused across multiple projects and have dynamic properties, set by the item
          creator.
        </p>

        <Alert>
          <InfoCircledIcon />
          <AlertTitle>Assembly is completely open</AlertTitle>
          <AlertDescription>Anyone can contribute code or create their own items!</AlertDescription>
        </Alert>
      </div>
    ),
  },
  {
    title: 'How to Craft Items?',
    description: 'The item creator defines required components and wildcards.',
    content: (
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="font-medium">Required Components</h4>
          <p className="text-muted-foreground">
            The exact components needed to craft the item. They can be otoms or other items
            (fungible or non-fungible).
          </p>
          <p className="text-muted-foreground">
            They have to exactly match the specified criteria: a name, or a token ID.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Wildcards</h4>
          <p className="text-muted-foreground">
            Wildcards are flexible slots, any otom element or item can be used as long as they match
            a given property range
          </p>
          <p className="text-muted-foreground">
            They have to match the specified criteria: a name, or a token ID.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Crafting Process</h4>
          <p className="text-muted-foreground">
            Drag components into blueprint slots. The system verifies you have the required
            components, burns them during crafting, and mints your new item with appropriate traits.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={paths.otom} target="_blank" rel="noopener noreferrer">
            Get Otoms at otom.xyz <ExternalLinkIcon className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    ),
  },
  {
    title: 'Item Types & Tiers',
    description: 'Understand fungible vs non-fungible items and the tier system.',
    content: (
      <div className="flex flex-col gap-2">
        <div>
          <h4 className="font-medium">Fungible Items</h4>
          <p className="text-muted-foreground">
            Resources or consumables that stack in inventory (like bricks, logs, ore). All instances
            are identical with the same properties.
          </p>
        </div>
        <div>
          <h4 className="font-medium">Non-Fungible Items</h4>
          <p className="text-muted-foreground">
            Unique items like equipment or tools that can have tiers (1-7) and dynamic properties.
            Each instance can have different traits that change through usage.
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-muted-foreground text-xs">
            💡 Non-fungible items have tiers calculated by mutator contracts based on components
            used and can be &quot;used&quot; to modify their traits over time.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={paths.otom} target="_blank" rel="noopener noreferrer">
            Explore the Otom ecosystem <ExternalLinkIcon className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    ),
  },
  {
    title: 'Create Your Own Items',
    description: 'Ready to become a creator? Design and submit your own blueprints.',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Assembly is completely open! Once you understand the crafting system, you can create your
          own item blueprints with custom properties, traits, and even mutator contracts for
          advanced functionality.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">What you can create:</h4>
          <ul className="text-muted-foreground ml-4 space-y-1">
            <li>• Tools and equipment with special abilities</li>
            <li>• Resources with custom properties and use cases</li>
            <li>• Complex items requiring rare Otom combinations</li>
            <li>• Interactive items with mutator contracts</li>
          </ul>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-muted-foreground text-xs">
            💡 All item metadata is stored onchain with SVG rendering. You can contribute to the
            project or submit items for the community to craft!
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={paths.create} target="_blank" rel="noopener noreferrer">
            Start Creating Items <ExternalLinkIcon className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    ),
  },
];

type OnboardingWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OnboardingWizard({ open, onOpenChange }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const step = onboardingSteps[currentStep];

  function handleNext() {
    if (isLastStep) {
      onOpenChange(false);
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  function handlePrevious() {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{step.title}</AlertDialogTitle>
          <AlertDialogDescription>{step.description}</AlertDialogDescription>
        </AlertDialogHeader>

        {step.content && <div className="py-2">{step.content}</div>}

        <AlertDialogFooter className="grid w-full grid-cols-3">
          <div className="flex justify-start gap-1">
            {!isFirstStep && (
              <Button variant="ghost" onClick={handlePrevious}>
                <ChevronLeftIcon />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center justify-center gap-1">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                      ? 'bg-primary/75'
                      : 'bg-primary/25'
                )}
              />
            ))}
          </div>

          <div className="flex justify-end gap-1">
            <Button onClick={handleNext} variant={isLastStep ? 'default' : 'ghost'}>
              {isLastStep ? (
                "Let's go!"
              ) : (
                <>
                  Next <ChevronRightIcon />
                </>
              )}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
