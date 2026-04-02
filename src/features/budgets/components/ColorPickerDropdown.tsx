'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { BUDGET_COLORS } from '@/src/lib/constants/budgets';

interface Props {
  value: string;        // hex value of selected color
  onChange: (value: string) => void;
  usedColors: string[]; // hex values already used by other budgets
}

export function ColorPickerDropdown({ value, onChange, usedColors }: Props) {
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

  const selected = BUDGET_COLORS.find(
    (c) => c.value.toLowerCase() === value.toLowerCase()
  );

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
        <div className="flex items-center gap-3">
          {selected && (
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: selected.value }}
            />
          )}
          <span className={cn('text-preset-4', selected ? 'text-grey-900' : 'text-beige-500')}>
            {selected?.name ?? 'Select a color'}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn('text-grey-900 shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* List */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-[0px_4px_24px_rgba(0,0,0,0.25)] max-h-60 overflow-y-auto"
        >
          {BUDGET_COLORS.map((color, i) => {
            const isUsed = usedColors.some(
              (u) => u.toLowerCase() === color.value.toLowerCase()
            );
            return (
              <li key={color.value} role="option" aria-selected={value.toLowerCase() === color.value.toLowerCase()}>
                {i > 0 && <div className="h-px bg-grey-100 mx-5" />}
                <button
                  type="button"
                  disabled={isUsed}
                  onClick={() => { onChange(color.value); setOpen(false); }}
                  className="w-full flex items-center justify-between px-5 py-3 disabled:cursor-default hover:bg-beige-100 disabled:hover:bg-transparent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn('w-4 h-4 rounded-full shrink-0', isUsed && 'opacity-40')}
                      style={{ backgroundColor: color.value }}
                    />
                    <span className={cn('text-preset-4', isUsed ? 'text-grey-500' : 'text-grey-900')}>
                      {color.name}
                    </span>
                  </div>
                  {isUsed && (
                    <span className="text-preset-5 text-grey-500">Already used</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
