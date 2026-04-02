'use client';

import { useEffect } from 'react';

interface BudgetModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export function BudgetModal({ onClose, children }: BudgetModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-[560px] bg-white rounded-xl p-8 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}
