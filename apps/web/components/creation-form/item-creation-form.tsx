'use client';

import {
  FormItemType,
  blueprintComponentsSchema,
  itemDetailsSchema,
  itemTypeSchema,
} from '@/components/creation-form/schema';
import {
  BlueprintComponentInput,
  BlueprintComponentsEditor,
  FungibleItemDetailsForm,
  FungibleItemFormData,
  ItemTraitsEditor,
  ItemTypeSelector,
  NavigationButtons,
  StepIndicator,
} from '@/components/creation-form/steps';
import { ItemTrait } from '@/components/creation-form/traits-editor';
import { Card, CardContent } from '@/components/ui/card';
import { useWriteAssemblyCoreContractCreateFungibleItem } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { itemCreationBannerDismissedAtom } from '@/lib/atoms';
import { config } from '@/lib/config';
import { paths } from '@/lib/paths';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { parseEther, zeroAddress } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';
import { z } from 'zod';

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
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [bannerDismissed, setBannerDismissed] = useAtom(itemCreationBannerDismissedAtom);
  const router = useRouter();

  const { writeContract, isPending, data } = useWriteAssemblyCoreContractCreateFungibleItem();
  const receipt = useWaitForTransactionReceipt({
    hash: data,
  });

  // Validate specific parts of the form using Zod
  const validateItemType = () => {
    try {
      itemTypeSchema.parse(type);
      setErrors((prev) => ({ ...prev, type: [] }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, type: error.errors.map((e) => e.message) }));
      }
      return false;
    }
  };

  const validateFungibleItemDetails = () => {
    try {
      if (parseFloat(formData.costInEth) > 0 && formData.feeRecipient === zeroAddress) {
        setErrors((prev) => ({
          ...prev,
          feeRecipient: ['Fee recipient is required when cost is greater than 0'],
        }));
        return false;
      }

      itemDetailsSchema.parse({
        name: formData.name,
        description: formData.description,
        imageUri: formData.imageUri,
        costInEth: formData.costInEth,
        feeRecipient: formData.feeRecipient,
      });
      setErrors((prev) => ({
        ...prev,
        name: [],
        description: [],
        imageUri: [],
        costInEth: [],
        feeRecipient: [],
      }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = newErrors[field] || [];
          newErrors[field].push(err.message);
        });
        setErrors((prev) => ({ ...prev, ...newErrors }));
      }
      return false;
    }
  };

  const validateBlueprintComponents = () => {
    try {
      blueprintComponentsSchema.parse(formData.blueprintComponents);
      setErrors((prev) => ({ ...prev, blueprintComponents: [] }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          blueprintComponents: error.errors.map((e) => e.message),
        }));
      }
      return false;
    }
  };

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
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateItemType();
        break;
      case 2:
        isValid = validateFungibleItemDetails();
        break;
      case 3:
        isValid = validateBlueprintComponents();
        break;
      default:
        isValid = true;
    }

    if (isValid && step < 4) {
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
    if (!writeContract) {
      console.error('Write function not available');
      return;
    }

    try {
      const blueprintComponents = formData.blueprintComponents.map((component) => {
        const componentTypeMap: Record<string, number> = {
          otom: 0,
          variable_otom: 1,
          fungible_item: 2,
          non_fungible_item: 3,
        };

        const formattedCriteria = (component.criteria || []).map((criterion) => {
          return {
            propertyType: criterion.propertyType || 0,
            minValue: BigInt(criterion.minValue || 0),
            maxValue: BigInt(criterion.maxValue || 0xffffffff),
            boolValue: !!criterion.boolValue,
            checkBoolValue: !!criterion.checkBoolValue,
            stringValue: criterion.stringValue || '',
            checkStringValue: !!criterion.checkStringValue,
            bytes32Value:
              '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
            checkBytes32Value: false,
          };
        });

        // Get component type as a number
        let componentTypeNumber = 0;
        if (typeof component.componentType === 'string') {
          componentTypeNumber = componentTypeMap[component.componentType] || 0;
        } else {
          componentTypeNumber = component.componentType;
        }

        return {
          componentType: componentTypeNumber,
          itemIdOrOtomTokenId: component.itemIdOrOtomTokenId
            ? BigInt(component.itemIdOrOtomTokenId)
            : BigInt(0),
          amount: BigInt(component.amount),
          criteria: formattedCriteria,
        };
      });

      // Convert form traits to contract Trait format
      const contractTraits = formData.traits.map((trait) => ({
        typeName: trait.typeName,
        valueString: trait.traitType === 'STRING' ? trait.valueString : '',
        valueNumber: trait.traitType === 'NUMBER' ? BigInt(trait.valueNumber) : 0n,
        traitType: trait.traitType === 'NUMBER' ? 0 : 1,
      }));

      writeContract({
        address: assemblyCore[config.chainId],
        args: [
          formData.name,
          formData.description,
          formData.imageUri,
          blueprintComponents,
          contractTraits,
          formData.costInEth ? parseEther(formData.costInEth) : 0n,
          formData.feeRecipient ?? zeroAddress,
        ],
      });

      console.log('Transaction submitted for item creation');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  function renderCurrentStep() {
    switch (step) {
      case 1:
        return (
          <div>
            <ItemTypeSelector selectedType={type || null} onSelect={handleSelectItemType} />
            {errors.type && errors.type.length > 0 && (
              <div className="mt-2 text-sm text-red-500">
                {errors.type.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>
        );
      case 2:
        if (type === 'fungible') {
          return (
            <Card className="mx-auto w-3xl">
              <CardContent>
                <FungibleItemDetailsForm
                  formData={formData}
                  onChange={handleFungibleItemInputChange}
                />
                {Object.entries(errors)
                  .filter(([key]) =>
                    ['name', 'description', 'imageUri', 'costInEth', 'feeRecipient'].includes(key)
                  )
                  .map(
                    ([key, errors]) =>
                      errors.length > 0 && (
                        <div key={key} className="mt-2 text-sm text-red-500">
                          {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                        </div>
                      )
                  )}
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
              {errors.blueprintComponents && errors.blueprintComponents.length > 0 && (
                <div className="mt-2 text-sm text-red-500">
                  {errors.blueprintComponents.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
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
                isNextDisabled={!isCurrentStepValid() || isPending}
              />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  }

  useEffect(() => {
    if (!data) return;
    if (receipt.isSuccess) {
      toast.success(
        <>
          Item created. See on{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={paths.explorer.transaction(data, config.chainId)}
          >
            ShapeScan
          </Link>
        </>,
        { id: 'tx-confirmation', duration: 4000 }
      );
      router.push(paths.home);
      return;
    }
    if (receipt.isPending) {
      toast.loading(
        <>
          Creating the item... See on{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={paths.explorer.transaction(data, config.chainId)}
          >
            ShapeScan
          </Link>
        </>,

        { id: 'tx-confirmation' }
      );
      return;
    }
    if (receipt.isError) {
      toast.error(
        <>Creation failed. Try again or contact Shape team on Discord</>,

        { id: 'tx-confirmation' }
      );
    }
  }, [data, receipt, router]);

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
