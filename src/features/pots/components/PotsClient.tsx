'use client';

import { useState } from 'react';
import { useGetPotsQuery } from '@/src/lib/features/pots/potsApiSlice';
import PotCard from './PotCard';
import { AddPotModal } from './AddPotModal';

export default function PotsClient() {
  const { data: pots = [], isLoading, isError } = useGetPotsQuery();
  const [addOpen, setAddOpen] = useState(false);

  const usedColors = pots.map((p) => p.theme);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-24 rounded-lg bg-grey-100 animate-pulse" />
          <div className="h-10 w-40 rounded-lg bg-grey-100 animate-pulse" />
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-grey-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl p-8">
        <p className="text-preset-4 text-red">Failed to load pots. Please refresh.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-preset-1 font-bold text-grey-900">Pots</h1>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="bg-grey-900 text-white text-preset-4 font-bold py-4 px-5 rounded-lg hover:bg-grey-500 transition-colors whitespace-nowrap"
          >
            + Add New Pot
          </button>
        </div>

        {/* Pots grid: 1 col mobile, 2 cols desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pots.map((pot) => (
            <PotCard key={pot.name} pot={pot} usedColors={usedColors} />
          ))}
        </div>
      </div>

      {addOpen && (
        <AddPotModal
          onClose={() => setAddOpen(false)}
          usedColors={usedColors}
        />
      )}
    </>
  );
}
