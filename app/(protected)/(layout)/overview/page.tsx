import OverviewClient from '@/src/features/overview/components/OverviewClient';

export const metadata = { title: 'Overview | Finance App' };

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-preset-1 font-bold text-grey-900 leading-preset-1">Overview</h1>
      <OverviewClient />
    </div>
  );
}
