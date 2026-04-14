'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  potName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PotActionsDropdown({ potName, onEdit, onDelete }: Props) {
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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Options for ${potName} pot`}
        aria-expanded={open}
        aria-haspopup="menu"
        className="cursor-pointer text-grey-300 hover:text-grey-500 transition-colors flex items-center justify-center w-6 h-6"
      >
        <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor" aria-hidden="true">
          <circle cx="2" cy="2" r="1.5" />
          <circle cx="8" cy="2" r="1.5" />
          <circle cx="14" cy="2" r="1.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-20 bg-white rounded-lg shadow-[0px_4px_24px_rgba(0,0,0,0.25)] py-3 px-5 flex flex-col gap-3 min-w-[132px]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => { onEdit(); setOpen(false); }}
            className="cursor-pointer text-left text-preset-4 text-grey-900 hover:text-grey-500 transition-colors whitespace-nowrap"
          >
            Edit Pot
          </button>
          <div className="h-px bg-grey-100" aria-hidden="true" />
          <button
            type="button"
            role="menuitem"
            onClick={() => { onDelete(); setOpen(false); }}
            className="cursor-pointer text-left text-preset-4 text-red hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            Delete Pot
          </button>
        </div>
      )}
    </div>
  );
}
