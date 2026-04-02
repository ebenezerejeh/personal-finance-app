import { z } from 'zod';

export const budgetSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  maximum: z
    .number({ error: 'Please enter a valid amount' })
    .positive('Amount must be greater than zero'),
  theme: z.string().min(1, 'Please select a theme color'),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
