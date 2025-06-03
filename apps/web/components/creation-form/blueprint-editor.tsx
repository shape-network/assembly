'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { paths } from '@/lib/paths';
import { PROPERTY_TYPE_MAP, formatPropertyName } from '@/lib/property-utils';
import { ComponentType, Criteria } from '@/lib/types';
import { HelpCircle, PlusCircle, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';

type PropertyCriterion = Criteria;

type BlueprintComponentInput = {
  componentType: ComponentType;
  itemIdOrOtomTokenId: string;
  amount: number;
  criteria: PropertyCriterion[];
};

type BlueprintEditorProps = {
  components: BlueprintComponentInput[];
  onChange: (components: BlueprintComponentInput[]) => void;
};

// Check if component type should have criteria
const shouldShowCriteria = (componentType: ComponentType): boolean => {
  return componentType === 'variable_otom';
};

export const BlueprintEditor: FC<BlueprintEditorProps> = ({ components, onChange }) => {
  const [newComponent, setNewComponent] = useState<BlueprintComponentInput>({
    componentType: 'otom',
    itemIdOrOtomTokenId: '',
    amount: 1,
    criteria: [],
  });

  const [newCriterion, setNewCriterion] = useState<PropertyCriterion>({
    propertyType: 9, // Default to Atom Radius (from property-utils.ts)
    minValue: 0,
    maxValue: 0,
  });

  const handleAddComponent = () => {
    onChange([...components, { ...newComponent }]);
    setNewComponent({
      componentType: 'otom',
      itemIdOrOtomTokenId: '',
      amount: 1,
      criteria: [],
    });
  };

  const handleRemoveComponent = (index: number) => {
    const newComponents = [...components];
    newComponents.splice(index, 1);
    onChange(newComponents);
  };

  const handleComponentChange = (
    index: number,
    field: keyof BlueprintComponentInput,
    value: string | number | ComponentType
  ) => {
    const newComponents = [...components];
    newComponents[index] = {
      ...newComponents[index],
      [field]: value,
    };
    onChange(newComponents);
  };

  const handleNewComponentChange = (
    field: keyof BlueprintComponentInput,
    value: string | number | ComponentType
  ) => {
    setNewComponent({
      ...newComponent,
      [field]: value,
    });
  };

  const handleAddCriterion = (componentIndex: number | null) => {
    if (componentIndex === null) {
      // Add to new component
      setNewComponent({
        ...newComponent,
        criteria: [...newComponent.criteria, { ...newCriterion }],
      });
    } else {
      // Add to existing component
      const newComponents = [...components];
      newComponents[componentIndex].criteria.push({ ...newCriterion });
      onChange(newComponents);
    }

    // Reset new criterion based on property type
    const propertyType = newCriterion.propertyType;
    const propertyInfo = PROPERTY_TYPE_MAP[propertyType];

    if (propertyInfo?.type === 'number') {
      setNewCriterion({
        propertyType,
        minValue: 0,
        maxValue: 0,
      });
    } else if (propertyInfo?.type === 'boolean') {
      setNewCriterion({
        propertyType,
        boolValue: false,
        checkBoolValue: true,
      });
    } else if (propertyInfo?.type === 'string') {
      setNewCriterion({
        propertyType,
        stringValue: '',
        checkStringValue: true,
      });
    } else {
      // Default to a number property
      setNewCriterion({
        propertyType: 9, // Atom Radius
        minValue: 0,
        maxValue: 0,
      });
    }
  };

  const showCriteriaEditor = shouldShowCriteria(newComponent.componentType);

  const handleRemoveCriterion = (componentIndex: number, criterionIndex: number) => {
    const newComponents = [...components];
    newComponents[componentIndex].criteria.splice(criterionIndex, 1);
    onChange(newComponents);
  };

  const handleNewCriterionChange = (
    field: keyof PropertyCriterion,
    value: string | number | boolean
  ) => {
    if (field === 'propertyType') {
      // When property type changes, reset values based on the type
      const propertyType = value as number;
      const propertyInfo = PROPERTY_TYPE_MAP[propertyType];

      if (propertyInfo?.type === 'number') {
        setNewCriterion({
          propertyType,
          minValue: 0,
          maxValue: 0,
        });
      } else if (propertyInfo?.type === 'boolean') {
        setNewCriterion({
          propertyType,
          boolValue: false,
          checkBoolValue: true,
        });
      } else if (propertyInfo?.type === 'string') {
        setNewCriterion({
          propertyType,
          stringValue: '',
          checkStringValue: true,
        });
      } else {
        // Default fallback
        setNewCriterion({
          propertyType,
        });
      }
    } else {
      // For other fields, just update the value
      setNewCriterion({
        ...newCriterion,
        [field]: value,
      });
    }
  };

  const handleCriterionChange = (
    componentIndex: number,
    criterionIndex: number,
    field: keyof PropertyCriterion,
    value: string | number | boolean
  ) => {
    const newComponents = [...components];
    newComponents[componentIndex].criteria[criterionIndex] = {
      ...newComponents[componentIndex].criteria[criterionIndex],
      [field]: value,
    };
    onChange(newComponents);
  };

  const renderCriteriaEditor = (criteria: PropertyCriterion[], componentIndex: number | null) => (
    <div className="bg-background col-span-2 mt-4 space-y-3 rounded-md p-3">
      <h5 className="text-sm font-medium">Property Criteria</h5>

      {criteria.length === 0 ? (
        <p className="text-muted-foreground text-xs">No criteria added</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {criteria.map((criterion, idx) => {
            const propertyInfo = PROPERTY_TYPE_MAP[criterion.propertyType];
            const propertyName = formatPropertyName(criterion.propertyType);

            return (
              <Card key={idx} className="bg-primary/5 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{propertyName}</span>
                    {componentIndex !== null && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveCriterion(componentIndex, idx)}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {propertyInfo?.type === 'number' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs">Min Value</Label>
                        <Input
                          type="number"
                          value={criterion.minValue ? criterion.minValue.toString() : '0'}
                          onChange={(e) => {
                            if (componentIndex !== null) {
                              handleCriterionChange(
                                componentIndex,
                                idx,
                                'minValue',
                                parseInt(e.target.value || '0')
                              );
                            }
                          }}
                          className="h-7"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs">Max Value</Label>
                        <Input
                          type="number"
                          value={criterion.maxValue ? criterion.maxValue.toString() : '0'}
                          onChange={(e) => {
                            if (componentIndex !== null) {
                              handleCriterionChange(
                                componentIndex,
                                idx,
                                'maxValue',
                                parseInt(e.target.value || '0')
                              );
                            }
                          }}
                          className="h-7"
                        />
                      </div>
                    </div>
                  )}

                  {propertyInfo?.type === 'boolean' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`bool-value-${componentIndex}-${idx}`}
                        checked={criterion.boolValue}
                        onCheckedChange={(checked) => {
                          if (componentIndex !== null) {
                            handleCriterionChange(componentIndex, idx, 'boolValue', !!checked);
                          }
                        }}
                      />
                      <Label htmlFor={`bool-value-${componentIndex}-${idx}`} className="text-xs">
                        Required Value
                      </Label>
                    </div>
                  )}

                  {propertyInfo?.type === 'string' && (
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs">String Value</Label>
                      <Input
                        value={criterion.stringValue || ''}
                        onChange={(e) => {
                          if (componentIndex !== null) {
                            handleCriterionChange(
                              componentIndex,
                              idx,
                              'stringValue',
                              e.target.value
                            );
                          }
                        }}
                        className="h-7"
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="bg-muted/50 rounded-md border p-3">
        <h6 className="mb-2 text-xs font-medium">Add Criterion</h6>
        <div className="grid gap-2">
          <div className="flex flex-col gap-2">
            <Label className="text-xs">Property Type</Label>
            <select
              className="border-input bg-background h-7 w-full rounded-md border px-3 py-1 text-xs"
              value={newCriterion.propertyType}
              onChange={(e) => handleNewCriterionChange('propertyType', parseInt(e.target.value))}
            >
              {Object.keys(PROPERTY_TYPE_MAP).map((key) => (
                <option key={key} value={key}>
                  {formatPropertyName(parseInt(key))}
                </option>
              ))}
            </select>
          </div>

          {PROPERTY_TYPE_MAP[newCriterion.propertyType]?.type === 'number' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Min Value</Label>
                <Input
                  type="number"
                  value={newCriterion.minValue ? newCriterion.minValue.toString() : '0'}
                  onChange={(e) =>
                    handleNewCriterionChange('minValue', parseInt(e.target.value || '0'))
                  }
                  className="h-7"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Max Value</Label>
                <Input
                  type="number"
                  value={newCriterion.maxValue ? newCriterion.maxValue.toString() : '0'}
                  onChange={(e) =>
                    handleNewCriterionChange('maxValue', parseInt(e.target.value || '0'))
                  }
                  className="h-7"
                />
              </div>
            </div>
          )}

          {PROPERTY_TYPE_MAP[newCriterion.propertyType]?.type === 'boolean' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-bool-value"
                checked={newCriterion.boolValue}
                onCheckedChange={(checked) => handleNewCriterionChange('boolValue', !!checked)}
              />
              <Label htmlFor="new-bool-value" className="text-xs">
                Required Value
              </Label>
            </div>
          )}

          {PROPERTY_TYPE_MAP[newCriterion.propertyType]?.type === 'string' && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">String Value</Label>
              <Input
                value={newCriterion.stringValue || ''}
                onChange={(e) => handleNewCriterionChange('stringValue', e.target.value)}
                className="h-7"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => handleAddCriterion(componentIndex)}
          >
            <PlusCircle className="mr-2 h-3 w-3" />
            Add Criterion
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {components.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">No components added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {components.map((component, index) => (
            <Card key={index} className="bg-primary/10 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveComponent(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-2">
                    <Label htmlFor={`component-type-${index}`}>Component Type</Label>
                    <select
                      id={`component-type-${index}`}
                      className="border-input bg-background h-9 w-full rounded-md border px-3 py-1"
                      value={component.componentType}
                      onChange={(e) =>
                        handleComponentChange(
                          index,
                          'componentType',
                          e.target.value as ComponentType
                        )
                      }
                    >
                      <option value="otom">Otom</option>
                      <option value="variable_otom">Variable Otom (Traits)</option>
                      <option value="fungible_item">Assembly Fungible Item</option>
                      <option value="non_fungible_item">Assembly Non-Fungible Item</option>
                    </select>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <Label htmlFor={`component-amount-${index}`}>Amount</Label>
                    <Input
                      id={`component-amount-${index}`}
                      type="number"
                      min="1"
                      value={component.amount}
                      onChange={(e) =>
                        handleComponentChange(index, 'amount', parseInt(e.target.value))
                      }
                    />
                  </div>

                  {/* Only show token ID field when not variable_otom */}
                  {component.componentType !== 'variable_otom' && (
                    <div className="col-span-2 flex flex-col gap-2">
                      <Label htmlFor={`component-id-${index}`}>
                        {component.componentType === 'otom' ? 'Otom Token ID' : 'Item ID'}
                      </Label>
                      <Input
                        id={`component-id-${index}`}
                        placeholder="Enter ID"
                        value={component.itemIdOrOtomTokenId}
                        onChange={(e) =>
                          handleComponentChange(index, 'itemIdOrOtomTokenId', e.target.value)
                        }
                      />
                    </div>
                  )}

                  {/* Only show criteria for variable_otom components */}
                  {shouldShowCriteria(component.componentType) &&
                    renderCriteriaEditor(component.criteria, index)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <h4 className="mb-3 text-sm font-medium">Add New Component</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-component-type">Component Type</Label>
              <select
                id="new-component-type"
                className="border-input bg-card h-9 w-full rounded-md border px-3 py-1"
                value={newComponent.componentType}
                onChange={(e) =>
                  handleNewComponentChange('componentType', e.target.value as ComponentType)
                }
              >
                <option value="otom">Otom</option>
                <option value="variable_otom">Variable Otom (Traits)</option>
                <option value="fungible_item">Assembly Fungible Item </option>
                <option value="non_fungible_item">Assembly Non-Fungible Item</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-component-amount">Amount</Label>
              <Input
                id="new-component-amount"
                type="number"
                min="1"
                value={newComponent.amount}
                onChange={(e) => handleNewComponentChange('amount', parseInt(e.target.value))}
              />
            </div>

            {/* Only show token ID field when not variable_otom */}
            {newComponent.componentType !== 'variable_otom' && (
              <div className="col-span-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="new-component-id">
                    {newComponent.componentType === 'otom' ? 'Otom Token ID' : 'Item ID'}
                  </Label>
                  {newComponent.componentType === 'otom' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0"
                          title="How to get the Otom ID"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>How to get the Otom ID</DialogTitle>
                          <DialogDescription className="space-y-6">
                            <p>
                              To get the Otom ID, you must go to{' '}
                              <Link
                                href={paths.otom}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                otoms.xyz
                              </Link>
                              , search for the Otom you want to use. Then, right-click on the Otom
                              and select <b>&quot;View Details&quot;</b> as the example below:
                            </p>
                            <div className="mt-2 w-full">
                              <video
                                src="/otoms-copy-id.mp4"
                                autoPlay
                                muted
                                playsInline
                                loop
                                className="h-auto w-full rounded-md border border-gray-200"
                                onLoadedMetadata={(e) => {
                                  const video = e.target as HTMLVideoElement;
                                  video.playbackRate = 0.5;
                                }}
                              />
                            </div>

                            <p>
                              You can also find a list of Otoms (Universe Alpha) and{' '}
                              <Link
                                href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSY6nasDSVjnOCGaxls_3UtO7K-t1d5MlOdmJMgW9uQQOdOCTOmWQnxUaODxWXbP61zPLzJa69hMzHL/pubhtml?gid=461026717&single=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold underline"
                              >
                                their difficulties here
                              </Link>
                              .
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <Input
                  id="new-component-id"
                  placeholder="Enter ID"
                  value={newComponent.itemIdOrOtomTokenId}
                  onChange={(e) => handleNewComponentChange('itemIdOrOtomTokenId', e.target.value)}
                />
              </div>
            )}

            {showCriteriaEditor && renderCriteriaEditor(newComponent.criteria, null)}
          </div>
          <Button
            className="mt-4 w-full"
            onClick={handleAddComponent}
            disabled={
              (newComponent.componentType !== 'variable_otom' &&
                !newComponent.itemIdOrOtomTokenId) ||
              newComponent.amount < 1
            }
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Component
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
