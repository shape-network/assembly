'use client';

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
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type OnboardingStep = {
  title: string;
  description: string;
  content?: React.ReactNode;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Assembly!',
    description: 'A flexible ERC1155 system for onchain item crafting built on Shape Network.',
    content: (
      <div className="space-y-3">
        <p className="text-sm">
          Assembly is a community-driven, open-source project that enables component-based crafting
          where items can be created using blueprints. Built on top of Otoms, it supports both
          fungible and non-fungible items with dynamic properties.
        </p>
        <p className="text-sm">
          Every item you craft is minted as an ERC1155 token and stored permanently onchain, with
          all metadata generated and stored onchain as well.
        </p>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-muted-foreground text-xs">
            💡 Assembly is completely open - anyone can contribute code or submit their own items!
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'How Blueprint Crafting Works',
    description: 'Learn about blueprints, component types, and the crafting system.',
    content: (
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium">Blueprints</h4>
          <p className="text-muted-foreground text-sm">
            Blueprints define the required components and their quantities needed to craft items.
            They can specify exact Otoms, variable Otoms with property criteria, or other items.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Component Types</h4>
          <p className="text-muted-foreground text-sm">
            Components can be specific Otoms, variable Otoms (any Otom meeting certain criteria),
            fungible items, or non-fungible items from previous crafting sessions.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Crafting Process</h4>
          <p className="text-muted-foreground text-sm">
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
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium">Fungible Items</h4>
          <p className="text-muted-foreground text-sm">
            Resources or consumables that stack in inventory (like bricks, logs, ore). All instances
            are identical with the same properties.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Non-Fungible Items</h4>
          <p className="text-muted-foreground text-sm">
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
      <div className="space-y-3">
        <p className="text-sm">
          Assembly is completely open! Once you understand the crafting system, you can create your
          own item blueprints with custom properties, traits, and even mutator contracts for
          advanced functionality.
        </p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">What you can create:</h4>
          <ul className="text-muted-foreground ml-4 space-y-1 text-sm">
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle>{step.title}</AlertDialogTitle>
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-primary'
                      : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <AlertDialogDescription>{step.description}</AlertDialogDescription>
        </AlertDialogHeader>

        {step.content && <div className="py-2">{step.content}</div>}

        <AlertDialogFooter>
          <div className="flex w-full justify-between">
            <div>
              {!isFirstStep && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeftIcon />
                </Button>
              )}
            </div>

            <Button onClick={handleNext} variant="ghost">
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
