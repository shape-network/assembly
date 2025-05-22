'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentType } from '@/lib/types';
import { PlusCircle, X } from 'lucide-react';
import { FC, useState } from 'react';

type PropertyCriterion = {
  propertyType: number;
  minValue?: number;
  maxValue?: number;
  boolValue?: boolean;
  checkBoolValue?: boolean;
  stringValue?: string;
  checkStringValue?: boolean;
};

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

export const BlueprintEditor: FC<BlueprintEditorProps> = ({ components, onChange }) => {
  const [newComponent, setNewComponent] = useState<BlueprintComponentInput>({
    componentType: 'otom',
    itemIdOrOtomTokenId: '',
    amount: 1,
    criteria: [],
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

  return (
    <div className="space-y-4">
      <ScrollArea className="h-72 pr-4">
        {components.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">No components added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {components.map((component, index) => (
              <Card key={index} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveComponent(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`component-type-${index}`}>Component Type</Label>
                      <select
                        id={`component-type-${index}`}
                        className="border-input bg-card h-9 w-full rounded-md border px-3 py-1"
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
                        <option value="variable_otom">Variable Otom</option>
                        <option value="fungible_item">Fungible Item</option>
                        <option value="non_fungible_item">Non-Fungible Item</option>
                      </select>
                    </div>
                    <div>
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
                    <div className="col-span-2">
                      <Label htmlFor={`component-id-${index}`}>
                        {component.componentType === 'otom' ||
                        component.componentType === 'variable_otom'
                          ? 'Otom Token ID'
                          : 'Item ID'}
                      </Label>
                      <Input
                        id={`component-id-${index}`}
                        placeholder={
                          component.componentType === 'variable_otom'
                            ? 'Leave empty for variable otom'
                            : 'Enter ID'
                        }
                        value={component.itemIdOrOtomTokenId}
                        onChange={(e) =>
                          handleComponentChange(index, 'itemIdOrOtomTokenId', e.target.value)
                        }
                        disabled={component.componentType === 'variable_otom'}
                      />
                    </div>
                    {/* Criteria will be implemented in a future version */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <Card>
        <CardContent className="p-4">
          <h4 className="mb-3 text-sm font-medium">Add New Component</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
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
                <option value="variable_otom">Variable Otom</option>
                <option value="fungible_item">Fungible Item</option>
                <option value="non_fungible_item">Non-Fungible Item</option>
              </select>
            </div>
            <div>
              <Label htmlFor="new-component-amount">Amount</Label>
              <Input
                id="new-component-amount"
                type="number"
                min="1"
                value={newComponent.amount}
                onChange={(e) => handleNewComponentChange('amount', parseInt(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="new-component-id">
                {newComponent.componentType === 'otom' ||
                newComponent.componentType === 'variable_otom'
                  ? 'Otom Token ID'
                  : 'Item ID'}
              </Label>
              <Input
                id="new-component-id"
                placeholder={
                  newComponent.componentType === 'variable_otom'
                    ? 'Leave empty for variable otom'
                    : 'Enter ID'
                }
                value={newComponent.itemIdOrOtomTokenId}
                onChange={(e) => handleNewComponentChange('itemIdOrOtomTokenId', e.target.value)}
                disabled={newComponent.componentType === 'variable_otom'}
              />
            </div>
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
