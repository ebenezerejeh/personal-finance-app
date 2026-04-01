import { cn } from '@/src/lib/utils';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';

interface SummaryRow {
  label: string;
  count: number;
  total: number;
  isDueSoon?: boolean;
}

interface Props {
  rows: SummaryRow[];
}

export default function SummaryCard({ rows }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-5">
      <h2 className="text-preset-3 font-bold text-grey-900">Summary</h2>
      <div className="flex flex-col gap-4">
        {rows.map(({ label, count, total, isDueSoon }, index) => (
          <div key={label}>
            {index > 0 && <div className="h-px bg-grey-100 mb-4" />}
            <div className="flex items-center justify-between">
              <p
                className={cn(
                  'text-preset-5',
                  isDueSoon ? 'text-red' : 'text-grey-500'
                )}
              >
                {label}
              </p>
              <p
                className={cn(
                  'text-preset-5 font-bold',
                  isDueSoon ? 'text-red' : 'text-grey-900'
                )}
              >
                {count} ({formatCurrency(total)})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
