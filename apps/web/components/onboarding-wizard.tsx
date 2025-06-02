'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type OnboardingStep = {
  title: string;
  description: string;
  content?: React.ReactNode;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Assembly!',
    description: 'Assembly is an onchain item crafting system built on Shape Network.',
    content: (
      <div className="space-y-3">
        <p className="text-sm">
          Assembly allows you to craft unique items using otoms (digital atoms) as components. Each
          item you create is minted as an NFT and stored permanently onchain.
        </p>
        <p className="text-sm">
          Get ready to explore the world of molecular crafting where chemistry meets creativity!
        </p>
      </div>
    ),
  },
  {
    title: 'How Crafting Works',
    description: 'Learn about blueprints, otoms, and the crafting process.',
    content: (
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium">Blueprints</h4>
          <p className="text-muted-foreground text-sm">
            Blueprints are recipes that define what otoms and items you need to craft new items.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Otoms</h4>
          <p className="text-muted-foreground text-sm">
            Otoms are digital atoms - the building blocks of everything you craft. Each otom
            represents a real chemical element.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium">Crafting Process</h4>
          <p className="text-muted-foreground text-sm">
            Drag otoms from your inventory into blueprint slots to craft items. The blockchain
            validates your recipe and mints your new item!
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={paths.otom} target="_blank" rel="noopener noreferrer">
            Explore otom.xyz <ExternalLinkIcon className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    ),
  },
  {
    title: 'About Otom.xyz',
    description: 'Discover the ecosystem behind Assembly.',
    content: (
      <div className="space-y-3">
        <p className="text-sm">
          Otom.xyz is the home of the digital periodic table where you can mine, trade, and discover
          otoms. It&apos;s the foundational layer that powers Assembly&apos;s crafting system.
        </p>
        <p className="text-sm">
          Every otom you use in Assembly comes from the otom.xyz ecosystem, creating a seamless
          bridge between element discovery and item creation.
        </p>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-muted-foreground text-xs">
            💡 Tip: You&apos;ll need otoms in your wallet to start crafting. Visit otom.xyz to begin
            your journey!
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Create Your Own Items',
    description: 'Ready to become a creator? Design your own blueprints.',
    content: (
      <div className="space-y-3">
        <p className="text-sm">
          Once you&apos;re comfortable with crafting existing items, you can create your own
          blueprints! Design unique items with custom properties and share them with the community.
        </p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">What you can create:</h4>
          <ul className="text-muted-foreground ml-4 space-y-1 text-sm">
            <li>• Tools with special abilities</li>
            <li>• Decorative items with unique properties</li>
            <li>• Complex molecules requiring rare otoms</li>
            <li>• Interactive items for games and applications</li>
          </ul>
        </div>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={paths.create} target="_blank" rel="noopener noreferrer">
            Start Creating <ExternalLinkIcon className="ml-1 h-3 w-3" />
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

  function handleSkip() {
    onOpenChange(false);
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
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <AlertDialogCancel onClick={handleSkip}>Skip</AlertDialogCancel>
              <AlertDialogAction onClick={handleNext}>
                {isLastStep ? "Let's go!" : 'Next'}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
