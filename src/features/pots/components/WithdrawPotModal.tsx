'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useWithdrawFromPotMutation } from '@/src/lib/features/pots/potsApiSlice';
import { potAmountSchema, type PotAmountFormValues } from '@/src/lib/validation/potSchema';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Pot } from '@/src/types';
import { PotModal } from './PotModal';

interface Props {
  pot: Pot;
  onClose: () => void;
}

export function WithdrawPotModal({ pot, onClose }: Props) {
  const [withdrawFromPot, { isLoading }] = useWithdrawFromPotMutation();

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
  const cappedDelta = Math.min(amount, pot.total);
  const newTotal = pot.total - cappedDelta;
  const newPct = pot.target > 0 ? Math.min(100, (newTotal / pot.target) * 100) : 0;
  const withdrawnPct = pot.target > 0 ? Math.min(100, (cappedDelta / pot.target) * 100) : 0;

  async function onSubmit(values: PotAmountFormValues) {
    if (values.amount > pot.total) {
      toast.error(`Cannot withdraw more than ${formatCurrency(pot.total)}`);
      return;
    }
    try {
      await withdrawFromPot({ name: pot.name, amount: values.amount }).unwrap();
      toast.success('Money withdrawn from pot');
      onClose();
    } catch {
      toast.error('Failed to withdraw money');
    }
  }

  return (
    <PotModal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">
          Withdraw from &lsquo;{pot.name}&rsquo;
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
        Withdraw from your pot to put the money back in your main balance.
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
            {/* Remaining after withdrawal */}
            {newPct > 0 && (
              <div
                className="h-full"
                style={{ width: `${newPct}%`, backgroundColor: pot.theme }}
              />
            )}
            {/* Gap */}
            {newPct > 0 && withdrawnPct > 0 && (
              <div className="h-full w-0.5 bg-white shrink-0" />
            )}
            {/* Withdrawn portion (red) */}
            {withdrawnPct > 0 && (
              <div
                className="h-full rounded-r bg-red"
                style={{ width: `${withdrawnPct}%` }}
              />
            )}
          </div>
          {/* Labels */}
          <div className="flex items-center justify-between">
            <p
              className="text-preset-5 font-bold"
              style={{ color: withdrawnPct > 0 ? '#C94736' : '#696868' }}
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
          <label className="text-preset-5 font-bold text-grey-500">Amount to Withdraw</label>
          <div className="flex items-center border border-beige-500 rounded-lg px-5 py-3 gap-3 focus-within:border-grey-900 transition-colors">
            <span className="text-preset-4 text-beige-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 50"
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
          {isLoading ? 'Withdrawing...' : 'Confirm Withdrawal'}
        </button>
      </form>
    </PotModal>
  );
}
