'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { BUDGET_CATEGORIES } from '@/src/lib/constants/budgets';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full flex items-center justify-between border border-beige-500 rounded-lg px-5 py-3 hover:border-grey-900 transition-colors"
      >
        <span className={cn('text-preset-4', value ? 'text-grey-900' : 'text-beige-500')}>
          {value || 'Select a category'}
        </span>
        <ChevronDown
          size={16}
          className={cn('text-grey-900 shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* List */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-[0px_4px_24px_rgba(0,0,0,0.25)] overflow-hidden max-h-60 overflow-y-auto"
        >
          {BUDGET_CATEGORIES.map((cat, i) => (
            <li key={cat} role="option" aria-selected={value === cat}>
              {i > 0 && <div className="h-px bg-grey-100 mx-5" />}
              <button
                type="button"
                onClick={() => { onChange(cat); setOpen(false); }}
                className="w-full text-left px-5 py-3 text-preset-4 text-grey-900 hover:bg-beige-100 transition-colors"
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
