'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useAddToPotMutation } from '@/src/lib/features/pots/potsApiSlice';
import { potAmountSchema, type PotAmountFormValues } from '@/src/lib/validation/potSchema';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Pot } from '@/src/types';
import { PotModal } from './PotModal';

interface Props {
  pot: Pot;
  onClose: () => void;
}

export function AddToPotModal({ pot, onClose }: Props) {
  const [addToPot, { isLoading }] = useAddToPotMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PotAmountFormValues>({
    resolver: zodResolver(potAmountSchema),
  });

  const rawAmount = watch('amount');
  const amount = rawAmount > 0 ? rawAmount : 0;
  const remaining = pot.target - pot.total;
  const cappedDelta = Math.min(amount, remaining);
  const newTotal = pot.total + cappedDelta;
  const newPct = pot.target > 0 ? Math.min(100, (newTotal / pot.target) * 100) : 0;
  const existingPct = pot.target > 0 ? Math.min(100, (pot.total / pot.target) * 100) : 0;
  const deltaPct = newPct - existingPct;

  async function onSubmit(values: PotAmountFormValues) {
    if (values.amount > remaining) {
      toast.error(`Cannot exceed remaining target of ${formatCurrency(remaining)}`);
      return;
    }
    try {
      await addToPot({ name: pot.name, amount: values.amount }).unwrap();
      toast.success('Money added to pot');
      onClose();
    } catch {
      toast.error('Failed to add money');
    }
  }

  return (
    <PotModal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">
          Add to &lsquo;{pot.name}&rsquo;
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
        Add money to your pot to keep track of your savings goal.
      </p>

      {/* Progress preview */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-preset-4 text-grey-500">New Amount</p>
          <p className="text-preset-1 font-bold text-grey-900">{formatCurrency(newTotal)}</p>
        </div>
        <div className="flex flex-col gap-3">
          {/* Bar */}
          <div className="bg-beige-100 h-2 rounded overflow-hidden flex">
            {/* Existing total */}
            {existingPct > 0 && (
              <div
                className="h-full"
                style={{ width: `${existingPct}%`, backgroundColor: pot.theme }}
              />
            )}
            {/* Gap */}
            {existingPct > 0 && deltaPct > 0 && (
              <div className="h-full w-0.5 bg-white shrink-0" />
            )}
            {/* Delta (added amount) */}
            {deltaPct > 0 && (
              <div
                className="h-full rounded-r"
                style={{ width: `${deltaPct}%`, backgroundColor: pot.theme, opacity: 0.5 }}
              />
            )}
          </div>
          {/* Labels */}
          <div className="flex items-center justify-between">
            <p
              className="text-preset-5 font-bold"
              style={{ color: deltaPct > 0 ? pot.theme : '#696868' }}
            >
              {newPct.toFixed(2)}%
            </p>
            <p className="text-preset-5 text-grey-500">
              Target of {formatCurrency(pot.target)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-preset-5 font-bold text-grey-500">Amount to Add</label>
          <div className="flex items-center border border-beige-500 rounded-lg px-5 py-3 gap-3 focus-within:border-grey-900 transition-colors">
            <span className="text-preset-4 text-beige-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 100"
              className="flex-1 text-preset-4 text-grey-900 placeholder:text-beige-500 outline-none bg-transparent"
              {...register('amount', { valueAsNumber: true })}
            />
          </div>
          {errors.amount && (
            <p className="text-preset-5 text-red">{errors.amount.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-grey-900 text-white text-preset-4 font-bold py-4 rounded-lg hover:bg-grey-500 transition-colors disabled:opacity-50 mt-1"
        >
          {isLoading ? 'Adding...' : 'Confirm Addition'}
        </button>
      </form>
    </PotModal>
  );
}
