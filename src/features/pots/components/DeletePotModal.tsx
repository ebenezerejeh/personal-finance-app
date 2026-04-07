'use client';

import { toast } from 'sonner';
import { X } from 'lucide-react';
import { useDeletePotMutation } from '@/src/lib/features/pots/potsApiSlice';
import type { Pot } from '@/src/types';
import { PotModal } from './PotModal';

interface Props {
  pot: Pot;
  onClose: () => void;
}

export function DeletePotModal({ pot, onClose }: Props) {
  const [deletePot, { isLoading }] = useDeletePotMutation();

  async function handleDelete() {
    try {
      await deletePot(pot.name).unwrap();
      toast.success('Pot deleted');
      onClose();
    } catch {
      toast.error('Failed to delete pot');
    }
  }

  return (
    <PotModal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">
          Delete &lsquo;{pot.name}&rsquo;?
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
        Are you sure you want to delete this pot? This action cannot be reversed, and all the data
        inside it will be removed forever.
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
    </PotModal>
  );
}
