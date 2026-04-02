'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useAddBudgetMutation } from '@/src/lib/features/budgets/budgetsApiSlice';
import { budgetSchema, type BudgetFormValues } from '@/src/lib/validation/budgetSchema';
import { BudgetModal } from './BudgetModal';
import { CategoryDropdown } from './CategoryDropdown';
import { ColorPickerDropdown } from './ColorPickerDropdown';

interface Props {
  onClose: () => void;
  usedColors: string[];
}

export function AddBudgetModal({ onClose, usedColors }: Props) {
  const [addBudget, { isLoading }] = useAddBudgetMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
  });

  const category = watch('category') ?? '';
  const theme = watch('theme') ?? '';

  async function onSubmit(values: BudgetFormValues) {
    try {
      await addBudget(values).unwrap();
      toast.success('Budget added');
      onClose();
    } catch {
      toast.error('Failed to add budget');
    }
  }

  return (
    <BudgetModal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-1 font-bold text-grey-900">Add New Budget</h2>
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
        Choose a category to set a spending budget. These categories can help you monitor spending.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Budget Category */}
        <div className="flex flex-col gap-1">
          <label className="text-preset-5 font-bold text-grey-500">Budget Category</label>
          <CategoryDropdown
            value={category}
            onChange={(v) => setValue('category', v, { shouldValidate: true })}
          />
          {errors.category && (
            <p className="text-preset-5 text-red">{errors.category.message}</p>
          )}
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
              placeholder="e.g. 2000"
              className="flex-1 text-preset-4 text-grey-900 placeholder:text-beige-500 outline-none bg-transparent"
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
            usedColors={usedColors}
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
          {isLoading ? 'Adding...' : 'Add Budget'}
        </button>
      </form>
    </BudgetModal>
  );
}
