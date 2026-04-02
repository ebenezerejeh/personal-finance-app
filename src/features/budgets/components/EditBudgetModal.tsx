'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useUpdateBudgetMutation } from '@/src/lib/features/budgets/budgetsApiSlice';
import { budgetSchema, type BudgetFormValues } from '@/src/lib/validation/budgetSchema';
import type { Budget } from '@/src/types';
import { BudgetModal } from './BudgetModal';
import { ColorPickerDropdown } from './ColorPickerDropdown';

interface Props {
  budget: Budget;
  onClose: () => void;
  usedColors: string[];
}

export function EditBudgetModal({ budget, onClose, usedColors }: Props) {
  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: budget.category,
      maximum: budget.maximum,
      theme: budget.theme,
    },
  });

  const theme = watch('theme');

  // Exclude this budget's own color so it can be re-selected
  const filteredUsedColors = usedColors.filter(
    (c) => c.toLowerCase() !== budget.theme.toLowerCase()
  );

  async function onSubmit(values: BudgetFormValues) {
    try {
      await updateBudget(values).unwrap();
      toast.success('Budget updated');
      onClose();
    } catch {
      toast.error('Failed to update budget');
    }
  }

  return (
    <BudgetModal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-1 font-bold text-grey-900">Edit Budget</h2>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-grey-300 hover:text-grey-900 transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      <p className="text-preset-4 text-grey-500">
        As your budgets change, feel free to update your spending limits.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Category — locked on edit */}
        <div className="flex flex-col gap-1">
          <label className="text-preset-5 font-bold text-grey-500">Budget Category</label>
          <div className="flex items-center border border-beige-500 rounded-lg px-5 py-3 bg-beige-100 cursor-not-allowed">
            <span className="text-preset-4 text-grey-900">{budget.category}</span>
          </div>
        </div>

        {/* Maximum Spend */}
        <div className="flex flex-col gap-1">
          <label className="text-preset-5 font-bold text-grey-500">Maximum Spend</label>
          <div className="flex items-center border border-beige-500 rounded-lg px-5 py-3 gap-3 focus-within:border-grey-900 transition-colors">
            <span className="text-preset-4 text-beige-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="flex-1 text-preset-4 text-grey-900 outline-none bg-transparent"
              {...register('maximum', { valueAsNumber: true })}
            />
          </div>
          {errors.maximum && (
            <p className="text-preset-5 text-red">{errors.maximum.message}</p>
          )}
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-1">
          <label className="text-preset-5 font-bold text-grey-500">Theme</label>
          <ColorPickerDropdown
            value={theme}
            onChange={(v) => setValue('theme', v, { shouldValidate: true })}
            usedColors={filteredUsedColors}
          />
          {errors.theme && (
            <p className="text-preset-5 text-red">{errors.theme.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-grey-900 text-white text-preset-4 font-bold py-4 rounded-lg hover:bg-grey-500 transition-colors disabled:opacity-50 mt-1"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </BudgetModal>
  );
}
