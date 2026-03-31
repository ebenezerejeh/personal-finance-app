import TransactionsClient from '@/src/features/transactions/components/TransactionsClient';

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-preset-1 font-bold text-grey-900">Transactions</h1>
      <TransactionsClient />
    </div>
  );
}
