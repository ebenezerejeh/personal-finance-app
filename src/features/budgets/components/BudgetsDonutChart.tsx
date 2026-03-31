import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';
import type { Budget } from '@/src/types';

interface Props {
  budgets: Budget[];
  spent: Record<string, number>;
}

export default function BudgetsDonutChart({ budgets, spent }: Props) {
  const chartData = budgets.map((b) => ({
    name: b.category,
    // Cap at maximum so no segment overflows; use small fallback to keep slice visible at $0
    value: Math.max(Math.min(spent[b.category] ?? 0, b.maximum), 0.001),
    theme: b.theme,
  }));

  const totalBudget = budgets.reduce((sum, b) => sum + b.maximum, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (spent[b.category] ?? 0), 0);

  return (
    <div className="relative w-[240px] h-[240px] mx-auto shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={81}
            outerRadius={120}
            dataKey="value"
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.theme} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
        <p className="text-preset-1 font-bold text-grey-900">{formatCurrency(totalSpent)}</p>
        <p className="text-preset-5 text-grey-500">of {formatCurrency(totalBudget)} limit</p>
      </div>
    </div>
  );
}
