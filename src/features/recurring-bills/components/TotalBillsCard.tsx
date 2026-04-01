import Image from 'next/image';
import { formatCurrency } from '@/src/lib/utils/formatCurrency';

interface Props {
  total: number;
}

export default function TotalBillsCard({ total }: Props) {
  return (
    <div className="bg-grey-900 rounded-xl p-6 flex flex-col gap-8">
      <Image
        src="/icon-recurring-bills.svg"
        alt=""
        width={40}
        height={40}
      />
      <div className="flex flex-col gap-3">
        <p className="text-preset-4 text-white">Total Bills</p>
        <p className="text-preset-1 font-bold text-white leading-preset-1">
          {formatCurrency(total)}
        </p>
      </div>
    </div>
  );
}
