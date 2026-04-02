'use client';

import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useDeleteBudgetMutation } from '@/src/lib/features/budgets/budgetsApiSlice';
import type { Budget } from '@/src/types';
import { BudgetModal } from './BudgetModal';

interface Props {
  budget: Budget;
  onClose: () => void;
}

export function DeleteBudgetModal({ budget, onClose }: Props) {
  const [deleteBudget, { isLoading }] = useDeleteBudgetMutation();

  async function handleDelete() {
    try {
      await deleteBudget(budget.category).unwrap();
      toast.success('Budget deleted');
      onClose();
    } catch {
      toast.error('Failed to delete budget');
    }
  }

  return (
    <BudgetModal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-1 font-bold text-grey-900">
          Delete &lsquo;{budget.category}&rsquo;?
        </h2>
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
        Are you sure you want to delete this budget? This action cannot be reversed, and all the
        data inside it will be removed forever.
      </p>

      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full bg-red text-white text-preset-4 font-bold py-4 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'Deleting...' : 'Yes, Confirm Deletion'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full text-preset-4 text-grey-500 hover:text-grey-900 transition-colors py-1 text-center"
        >
          No, Go Back
        </button>
      </div>
    </BudgetModal>
  );
}
