'use client';

import { useState } from 'react';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Pot } from '@/src/types';
import { PotActionsDropdown } from './PotActionsDropdown';
import { EditPotModal } from './EditPotModal';
import { DeletePotModal } from './DeletePotModal';
import { AddToPotModal } from './AddToPotModal';
import { WithdrawPotModal } from './WithdrawPotModal';

type ModalType = 'edit' | 'delete' | 'add' | 'withdraw' | null;

interface Props {
  pot: Pot;
  usedColors: string[];
}

export default function PotCard({ pot, usedColors }: Props) {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const pct = pot.target > 0 ? Math.min(100, (pot.total / pot.target) * 100) : 0;

  return (
    <>
      <div className="bg-white rounded-xl p-5 sm:p-6 flex flex-col gap-8">
        {/* Header: color dot + name + menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: pot.theme }}
            />
            <h2 className="text-preset-2 font-bold text-grey-900">{pot.name}</h2>
          </div>
          <PotActionsDropdown
            potName={pot.name}
            onEdit={() => setOpenModal('edit')}
            onDelete={() => setOpenModal('delete')}
          />
        </div>

        {/* Total saved + progress bar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-preset-4 text-grey-500">Total Saved</p>
            <p className="text-preset-1 font-bold text-grey-900">
              {formatCurrency(pot.total)}
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-3">
            <div className="bg-beige-100 h-2 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: pot.theme }}
              />
            </div>

            {/* Percentage + target */}
            <div className="flex items-center justify-between">
              <p className="text-preset-5 font-bold text-grey-500">
                {pct.toFixed(1)}%
              </p>
              <p className="text-preset-5 text-grey-500">
                Target of {formatCurrency(pot.target)}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setOpenModal('add')}
            className="flex-1 bg-beige-100 text-grey-900 text-preset-4 font-bold py-4 rounded-lg hover:bg-grey-100 transition-colors whitespace-nowrap"
          >
            + Add Money
          </button>
          <button
            type="button"
            onClick={() => setOpenModal('withdraw')}
            className="flex-1 bg-beige-100 text-grey-900 text-preset-4 font-bold py-4 rounded-lg hover:bg-grey-100 transition-colors whitespace-nowrap"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Modals */}
      {openModal === 'edit' && (
        <EditPotModal
          pot={pot}
          onClose={() => setOpenModal(null)}
          usedColors={usedColors}
        />
      )}
      {openModal === 'delete' && (
        <DeletePotModal
          pot={pot}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'add' && (
        <AddToPotModal
          pot={pot}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'withdraw' && (
        <WithdrawPotModal
          pot={pot}
          onClose={() => setOpenModal(null)}
        />
      )}
    </>
  );
}
