import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Balance } from '@/src/types';

interface Props {
  balance: Balance;
}

export default function BalanceCards({ balance }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {/* Current Balance — dark card */}
      <div className="bg-grey-900 rounded-2xl px-6 py-6 flex flex-col gap-3">
        <p className="text-preset-4 text-white leading-preset-4">Current Balance</p>
        <p className="text-preset-1 font-bold text-white leading-preset-1">
          {formatCurrency(balance.current)}
        </p>
      </div>

      {/* Income */}
      <div className="bg-white rounded-2xl px-6 py-6 flex flex-col gap-3">
        <p className="text-preset-4 text-grey-500 leading-preset-4">Income</p>
        <p className="text-preset-1 font-bold text-grey-900 leading-preset-1">
          {formatCurrency(balance.income)}
        </p>
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-2xl px-6 py-6 flex flex-col gap-3">
        <p className="text-preset-4 text-grey-500 leading-preset-4">Expenses</p>
        <p className="text-preset-1 font-bold text-grey-900 leading-preset-1">
          {formatCurrency(balance.expenses)}
        </p>
      </div>
    </div>
  );
}
