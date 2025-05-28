import { isAddress } from 'viem';
import { z } from 'zod';

export const itemTypeSchema = z.enum(['fungible', 'non-fungible']);

export type FormItemType = z.infer<typeof itemTypeSchema>;

export const itemDetailsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(2, 'Description is required'),
  imageUri: z.string().url('Image URI must be a valid URL'),
  costInEth: z.string(),
  feeRecipient: z.string().refine((val) => isAddress(val), {
    message: 'Fee recipient must be a valid address',
  }),
});

export const blueprintComponentsSchema = z
  .array(
    z.object({
      componentType: z.union([z.string(), z.number()]),
      itemIdOrOtomTokenId: z.string(),
      amount: z.number().min(1, 'Amount must be at least 1'),
      criteria: z.array(z.any()),
    })
  )
  .min(1, 'At least one component is required');

export const traitsSchema = z.array(
  z.object({
    typeName: z.string().min(1, 'Trait name is required'),
    traitType: z.enum(['STRING', 'NUMBER']),
    valueString: z.string(),
    valueNumber: z.number(),
  })
);

export const itemCreationSchema = z.object({
  type: itemTypeSchema,
  name: itemDetailsSchema.shape.name,
  description: itemDetailsSchema.shape.description,
  imageUri: itemDetailsSchema.shape.imageUri,
  costInEth: itemDetailsSchema.shape.costInEth,
  feeRecipient: itemDetailsSchema.shape.feeRecipient,
  blueprintComponents: blueprintComponentsSchema,
  traits: traitsSchema,
});

export type ItemCreationFormValues = z.infer<typeof itemCreationSchema>;
