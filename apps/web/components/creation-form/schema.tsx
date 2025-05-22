import { z } from 'zod';

export const itemTypeSchema = z.enum(['fungible', 'non-fungible']);

export type FormItemType = z.infer<typeof itemTypeSchema>;

export const fungibleItemDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUri: z.string().min(1, 'Image URI is required'),
  costInEth: z.string(),
  feeRecipient: z.string(),
});

export const blueprintComponentSchema = z.object({
  componentType: z.union([z.string(), z.number()]),
  itemIdOrOtomTokenId: z.string(),
  amount: z.number().min(1, 'Amount must be at least 1'),
  criteria: z.array(z.any()),
});

export const blueprintComponentsSchema = z
  .array(blueprintComponentSchema)
  .min(1, 'At least one component is required');

export const traitSchema = z.object({
  typeName: z.string().min(1, 'Trait name is required'),
  traitType: z.enum(['STRING', 'NUMBER']),
  valueString: z.string(),
  valueNumber: z.string(),
});

export const traitsSchema = z.array(traitSchema);

export const itemCreationSchema = z.object({
  type: itemTypeSchema,
  name: fungibleItemDetailsSchema.shape.name,
  description: fungibleItemDetailsSchema.shape.description,
  imageUri: fungibleItemDetailsSchema.shape.imageUri,
  costInEth: fungibleItemDetailsSchema.shape.costInEth,
  feeRecipient: fungibleItemDetailsSchema.shape.feeRecipient,
  blueprintComponents: blueprintComponentsSchema,
  traits: traitsSchema,
});

export type ItemCreationFormValues = z.infer<typeof itemCreationSchema>;
