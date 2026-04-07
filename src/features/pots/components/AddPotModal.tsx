'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useAddPotMutation } from '@/src/lib/features/pots/potsApiSlice';
import { potSchema, type PotFormValues } from '@/src/lib/validation/potSchema';
import { ColorPickerDropdown } from '@/src/features/budgets/components/ColorPickerDropdown';
import { PotModal } from './PotModal';
import type { Pot } from '@/src/types';

interface Props {
  onClose: () => void;
  usedColors: string[];
}

export function AddPotModal({ onClose, usedColors }: Props) {
  const [addPot, { isLoading }] = useAddPotMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PotFormValues>({
    resolver: zodResolver(potSchema),
    defaultValues: { name: '', theme: '' },
  });

  const name = watch('name') ?? '';
  const theme = watch('theme') ?? '';

  async function onSubmit(values: PotFormValues) {
    const newPot: Pot = { name: values.name, target: values.target, total: 0, theme: values.theme };
    try {
      await addPot(newPot).unwrap();
      toast.success('Pot added');
      onClose();
    } catch {
      toast.error('Failed to add pot');
    }
  }

  return (
    <PotModal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">Add New Pot</h2>
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
        Create a pot to set savings targets. These can help you keep track of your goals.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Pot Name */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-preset-5 font-bold text-grey-500">Pot Name</label>
            <span className="text-preset-5 text-grey-500">{30 - name.length} of 30 characters left</span>
          </div>
          <input
            type="text"
            maxLength={30}
            placeholder="e.g. Rainy Days"
            className="w-full border border-beige-500 rounded-lg px-5 py-3 text-preset-4 text-grey-900 placeholder:text-beige-500 outline-none focus:border-grey-900 transition-colors bg-transparent"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-preset-5 text-red">{errors.name.message}</p>
          )}
        </div>

        {/* Target */}
        <div className="flex flex-col gap-1">
          <label className="text-preset-5 font-bold text-grey-500">Target</label>
          <div className="flex items-center border border-beige-500 rounded-lg px-5 py-3 gap-3 focus-within:border-grey-900 transition-colors">
            <span className="text-preset-4 text-beige-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 2000"
              className="flex-1 text-preset-4 text-grey-900 placeholder:text-beige-500 outline-none bg-transparent"
              {...register('target', { valueAsNumber: true })}
            />
          </div>
          {errors.target && (
            <p className="text-preset-5 text-red">{errors.target.message}</p>
          )}
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-1">
          <label className="text-preset-5 font-bold text-grey-500">Color Tag</label>
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
          {isLoading ? 'Adding...' : 'Add Pot'}
        </button>
      </form>
    </PotModal>
  );
}
