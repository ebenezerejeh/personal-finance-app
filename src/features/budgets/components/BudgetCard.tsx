'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/src/lib/utils/formatCurrency';
import type { Budget, Transaction } from '@/src/types';
import { BudgetActionsDropdown } from './BudgetActionsDropdown';
import { EditBudgetModal } from './EditBudgetModal';
import { DeleteBudgetModal } from './DeleteBudgetModal';

function getAvatarSrc(avatar: string): string {
  return `/avatars/${avatar.replace('./assets/images/avatars/', '')}`;
}

interface Props {
  budget: Budget;
  spent: number;
  remaining: number;
  latestTransactions: Transaction[];
  usedColors: string[];
}

export default function BudgetCard({ budget, spent, remaining, latestTransactions, usedColors }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const pct = budget.maximum > 0 ? Math.min(100, (spent / budget.maximum) * 100) : 0;

  return (
    <>
      <div className="bg-white rounded-xl p-5 sm:p-8 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: budget.theme }}
            />
            <h2 className="text-preset-2 font-bold text-grey-900">{budget.category}</h2>
          </div>
          <BudgetActionsDropdown
            category={budget.category}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        </div>

        {/* Amount bar */}
        <div className="flex flex-col gap-4">
          <p className="text-preset-4 text-grey-500">Maximum of {formatCurrency(budget.maximum)}</p>

          {/* Progress bar */}
          <div className="bg-beige-100 h-8 p-1 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: budget.theme }}
            />
          </div>

          {/* Spent / Remaining */}
          <div className="flex gap-4">
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <div
                className="w-1 self-stretch rounded-full shrink-0"
                style={{ backgroundColor: budget.theme }}
              />
              <div className="flex flex-col gap-1">
                <span className="text-preset-5 text-grey-500">Spent</span>
                <span className="text-preset-4 font-bold text-grey-900">{formatCurrency(spent)}</span>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <div className="w-1 self-stretch rounded-full bg-beige-100 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-preset-5 text-grey-500">Remaining</span>
                <span className="text-preset-4 font-bold text-grey-900">{formatCurrency(remaining)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Spending */}
        <div className="bg-beige-100 rounded-xl p-4 sm:p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-preset-3 font-bold text-grey-900">Latest Spending</h3>
            <Link
              href="/transactions"
              className="flex items-center gap-3 text-preset-4 text-grey-500 hover:text-grey-900 transition-colors"
            >
              See All
              <Image src="/icon-caret-right.svg" alt="" width={6} height={11} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {latestTransactions.length === 0 ? (
              <p className="text-preset-5 text-grey-500">No transactions this period.</p>
            ) : (
              latestTransactions.map((t, index) => (
                <div key={`${t.name}-${t.date}-${index}`}>
                  {index > 0 && <div className="h-px bg-grey-500/15 mb-3" />}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-3 min-w-0">
                      <Image
                        src={getAvatarSrc(t.avatar)}
                        alt={t.name}
                        width={32}
                        height={32}
                        className="hidden sm:block rounded-full object-cover shrink-0"
                      />
                      <p className="text-preset-5 font-bold text-grey-900 truncate">{t.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                      <p className="text-preset-5 font-bold text-grey-900">{formatCurrency(t.amount)}</p>
                      <p className="text-preset-5 text-grey-500">{formatDate(t.date)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <EditBudgetModal
          budget={budget}
          onClose={() => setEditOpen(false)}
          usedColors={usedColors}
        />
      )}
      {deleteOpen && (
        <DeleteBudgetModal
          budget={budget}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </>
  );
}
