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
      <div className="mt-5 flex flex-col gap-4">
        <p>
          Built on top of Otoms, every item you craft is minted as an ERC1155 token and stored
          permanently onchain.
        </p>
        <p>
          Items can be reused across multiple projects and have dynamic properties, set by the item
          creator.
        </p>

        <Alert className="hidden sm:grid">
          <InfoCircledIcon />
          <AlertTitle>Assembly is completely open</AlertTitle>
          <AlertDescription>Anyone can contribute code or create their own items!</AlertDescription>
        </Alert>

        <Button variant="outline" size="sm" asChild className="hidden w-full sm:flex">
          <a href={paths.repo} target="_blank" rel="noopener noreferrer">
            View Source Code <ExternalLinkIcon className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    ),
  },
  {
    title: 'How to Craft Items?',
    description: 'The item creator defines required components and wildcards.',
    content: (
      <div className="mt-5 flex flex-col gap-4">
        <div>
          <h4 className="font-medium">Required Components</h4>
          <p className="text-muted-foreground">
            They can be otoms or other items that exactly match the specified criteria: a name, or a
            token ID.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Wildcards</h4>
          <p className="text-muted-foreground">
            They are flexible slots for any component that matches a given property range, like a
            mass between 1 and 1000, more than 3 electrons, etc.
          </p>
        </div>

        <Button variant="outline" size="sm" asChild className="hidden w-full sm:flex">
          <a href={paths.otom} target="_blank" rel="noopener noreferrer">
            Get Otoms at otom.xyz <ExternalLinkIcon className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    ),
  },
  {
    title: 'Item Types & Tiers',
    description: 'Fungible vs non-fungible items and the tier system.',
    content: (
      <div className="mt-5 flex flex-col gap-4">
        <div>
          <h4 className="font-medium">Fungible Items</h4>
          <p className="text-muted-foreground">
            Resources or consumables that stack in your inventory (like bricks, logs, ore). All
            instances are identical with the same properties.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Non-Fungible Items</h4>
          <p className="text-muted-foreground">
            Unique items like equipment or tools that can have tiers (1-7) and dynamic properties.
            Each instance can have different traits that change through usage.
          </p>
        </div>
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
      <AlertDialogContent className="grid grid-rows-[1fr_auto] sm:min-h-[522px] sm:max-w-xl">
        <div>
          <AlertDialogHeader>
            <AlertDialogTitle>{step.title}</AlertDialogTitle>
            <AlertDialogDescription>{step.description}</AlertDialogDescription>
          </AlertDialogHeader>

          {step.content && <div className="py-2">{step.content}</div>}
        </div>

        <AlertDialogFooter className="grid w-full grid-cols-3">
          <div className="flex items-end justify-start gap-1">
            {!isFirstStep && (
              <Button variant="ghost" onClick={handlePrevious} size="sm">
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
                  index === currentStep ? 'bg-primary' : 'bg-primary/20'
                )}
              />
            ))}
          </div>

          <div className="flex items-end justify-end gap-1">
            <Button onClick={handleNext} variant={isLastStep ? 'default' : 'ghost'} size="sm">
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
