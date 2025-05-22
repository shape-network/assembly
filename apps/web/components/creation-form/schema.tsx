import { z } from 'zod';

export type FormItemType = 'fungible' | 'non-fungible';

/**
 * Schema for validating item type selection
 */
export const itemTypeSchema = z.enum(['fungible', 'non-fungible']);

/**
 * Schema for validating fungible item details
 */
export const fungibleItemDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUri: z.string().min(1, 'Image URI is required'),
  costInEth: z.string(),
  feeRecipient: z.string(),
});

/**
 * Schema for validating a blueprint component
 */
export const blueprintComponentSchema = z.object({
  componentType: z.union([z.string(), z.number()]),
  itemIdOrOtomTokenId: z.string(),
  amount: z.number().min(1, 'Amount must be at least 1'),
  criteria: z.array(z.any()),
});

/**
 * Schema for validating a collection of blueprint components
 */
export const blueprintComponentsSchema = z
  .array(blueprintComponentSchema)
  .min(1, 'At least one component is required');

/**
 * Schema for validating a trait
 */
export const traitSchema = z.object({
  typeName: z.string().min(1, 'Trait name is required'),
  traitType: z.enum(['STRING', 'NUMBER']),
  valueString: z.string(),
  valueNumber: z.string(),
});

/**
 * Schema for validating a collection of traits
 */
export const traitsSchema = z.array(traitSchema);

/**
 * Combined schema for the entire item creation form
 */
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
