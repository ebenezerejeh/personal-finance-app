import BudgetsDonutChart from './BudgetsDonutChart';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Budget } from '@/src/types';

interface Props {
  budgets: Budget[];
  spent: Record<string, number>;
}

export default function BudgetsSummaryPanel({ budgets, spent }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-8 flex flex-col gap-8 h-full">
      {/*
        Responsive inner direction:
        - Mobile (default): flex-col — chart stacked above summary
        - Tablet (md):      flex-row — chart and summary side-by-side
        - Desktop (lg):     flex-col — back to stacked (panel lives in a left column)
      */}
      <div className="flex flex-col md:flex-row lg:flex-col gap-8">
        {/* Donut chart */}
        <div className="flex items-center justify-center md:flex-1 lg:flex-none">
          <BudgetsDonutChart budgets={budgets} spent={spent} />
        </div>

        {/* Spending Summary */}
        <div className="flex flex-col gap-6 md:flex-1 lg:flex-none">
          <h2 className="text-preset-2 font-bold text-grey-900">Spending Summary</h2>
          <div className="flex flex-col gap-4">
            {budgets.map((budget, index) => {
              const spentAmount = spent[budget.category] ?? 0;
              return (
                <div key={budget.category}>
                  {index > 0 && <div className="h-px bg-grey-100 mb-4" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 self-stretch">
                      <div
                        className="w-1 self-stretch rounded-full shrink-0"
                        style={{ backgroundColor: budget.theme }}
                      />
                      <span className="text-preset-4 text-grey-500">{budget.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-preset-3 font-bold text-grey-900">
                        {formatCurrency(spentAmount)}
                      </span>
                      <span className="text-preset-5 text-grey-500">
                        of {formatCurrency(budget.maximum)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
