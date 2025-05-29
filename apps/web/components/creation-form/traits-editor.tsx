'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, X } from 'lucide-react';
import { FC, useState } from 'react';

export type ItemTrait = {
  typeName: string;
  valueString: string;
  valueNumber: string;
  traitType: 'NUMBER' | 'STRING';
};

type TraitsEditorProps = {
  traits: ItemTrait[];
  onChange: (traits: ItemTrait[]) => void;
};

export const TraitsEditor: FC<TraitsEditorProps> = ({ traits, onChange }) => {
  const [newTrait, setNewTrait] = useState<ItemTrait>({
    typeName: '',
    valueString: '',
    valueNumber: '0',
    traitType: 'STRING',
  });

  const handleAddTrait = () => {
    onChange([...traits, { ...newTrait }]);
    setNewTrait({
      typeName: '',
      valueString: '',
      valueNumber: '0',
      traitType: 'STRING',
    });
  };

  const handleRemoveTrait = (index: number) => {
    const newTraits = [...traits];
    newTraits.splice(index, 1);
    onChange(newTraits);
  };

  const handleTraitChange = (
    index: number,
    field: keyof ItemTrait,
    value: string | 'NUMBER' | 'STRING'
  ) => {
    const newTraits = [...traits];
    newTraits[index] = {
      ...newTraits[index],
      [field]: value,
    };
    onChange(newTraits);
  };

  const handleNewTraitChange = (field: keyof ItemTrait, value: string | 'NUMBER' | 'STRING') => {
    setNewTrait({
      ...newTrait,
      [field]: value,
    });
  };

  const isValidNewTrait =
    newTrait.typeName &&
    (newTrait.traitType === 'STRING' ? !!newTrait.valueString : !!newTrait.valueNumber);

  return (
    <div className="space-y-4">
      {traits.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">No traits added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {traits.map((trait, index) => (
            <Card key={index} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveTrait(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="p-4">
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`trait-name-${index}`}>Trait Name</Label>
                    <Input
                      id={`trait-name-${index}`}
                      value={trait.typeName}
                      onChange={(e) => handleTraitChange(index, 'typeName', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="mb-2 block">Trait Type</Label>
                    <RadioGroup
                      value={trait.traitType}
                      onValueChange={(value: 'NUMBER' | 'STRING') =>
                        handleTraitChange(index, 'traitType', value)
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id={`string-type-${index}`} value="STRING" />
                        <Label htmlFor={`string-type-${index}`}>String</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id={`number-type-${index}`} value="NUMBER" />
                        <Label htmlFor={`number-type-${index}`}>Number</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {trait.traitType === 'STRING' ? (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`trait-value-string-${index}`}>String Value</Label>
                      <Input
                        id={`trait-value-string-${index}`}
                        value={trait.valueString}
                        onChange={(e) => handleTraitChange(index, 'valueString', e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`trait-value-number-${index}`}>Number Value</Label>
                      <Input
                        id={`trait-value-number-${index}`}
                        type="number"
                        value={trait.valueNumber}
                        onChange={(e) => handleTraitChange(index, 'valueNumber', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <h4 className="mb-3 text-sm font-medium">Add New Trait</h4>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-trait-name">Trait Name</Label>
              <Input
                id="new-trait-name"
                placeholder="e.g., Material, Power, Rarity"
                value={newTrait.typeName}
                onChange={(e) => handleNewTraitChange('typeName', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="mb-2 block">Trait Type</Label>
              <RadioGroup
                value={newTrait.traitType}
                onValueChange={(value: 'NUMBER' | 'STRING') =>
                  handleNewTraitChange('traitType', value)
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="new-string-type" value="STRING" />
                  <Label htmlFor="new-string-type">String</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="new-number-type" value="NUMBER" />
                  <Label htmlFor="new-number-type">Number</Label>
                </div>
              </RadioGroup>
            </div>

            {newTrait.traitType === 'STRING' ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-trait-value-string">String Value</Label>
                <Input
                  id="new-trait-value-string"
                  placeholder="e.g., Steel, Rare, Common"
                  value={newTrait.valueString}
                  onChange={(e) => handleNewTraitChange('valueString', e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-trait-value-number">Number Value</Label>
                <Input
                  id="new-trait-value-number"
                  type="number"
                  placeholder="e.g., 10, 100, 1000"
                  value={newTrait.valueNumber}
                  onChange={(e) => handleNewTraitChange('valueNumber', e.target.value)}
                />
              </div>
            )}
          </div>

          <Button className="mt-4 w-full" onClick={handleAddTrait} disabled={!isValidNewTrait}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trait
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
