import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Pot } from '@/src/types';

interface Props {
  pots: Pot[];
}

export default function PotsCard({ pots }: Props) {
  const totalSaved = pots.reduce((sum, p) => sum + p.total, 0);
  const displayPots = pots.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-preset-2 font-bold text-grey-900">Pots</h2>
        <Link
          href="/pots"
          className="flex items-center gap-3 text-preset-4 text-grey-500 hover:text-grey-900 transition-colors"
        >
          See Details
          <Image src="/icon-caret-right.svg" alt="" width={6} height={11} className="filter-[brightness(0)_opacity(0.4)]" />
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Total saved pill */}
        <div className="flex items-center gap-4 bg-beige-100 rounded-xl p-4 sm:w-45 shrink-0">
          <Image src="/icon-pot.svg" alt="" width={40} height={40} />
          <div className="flex flex-col gap-1">
            <p className="text-preset-4 text-grey-500 leading-preset-4">Total Saved</p>
            <p className="text-preset-1 font-bold text-grey-900 leading-preset-1">
              {formatCurrency(totalSaved)}
            </p>
          </div>
        </div>

        {/* Pots grid */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {displayPots.map((pot) => (
            <div key={pot.name} className="flex items-center gap-3">
              <span
                className="w-1 h-10 rounded-full shrink-0"
                style={{ backgroundColor: pot.theme }}
              />
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-preset-5 text-grey-500 leading-preset-5 truncate">{pot.name}</p>
                <p className="text-preset-4 font-bold text-grey-900 leading-preset-4">
                  {formatCurrency(pot.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
