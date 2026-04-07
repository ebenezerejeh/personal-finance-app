import { z } from 'zod';

export const potSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Max 30 characters'),
  target: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .positive('Amount must be greater than zero'),
  theme: z.string().min(1, 'Please select a theme color'),
});

export type PotFormValues = z.infer<typeof potSchema>;

export const potAmountSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .positive('Amount must be greater than zero'),
});

export type PotAmountFormValues = z.infer<typeof potAmountSchema>;
