'use client';

import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  type ColumnDef,
  type FilterFn,
} from '@tanstack/react-table';
import { useGetTransactionsQuery } from '@/src/lib/features/transactions/transactionsApiSlice';
import type { Transaction } from '@/src/types';
import type { SortOption } from './TransactionsFilters';
import TransactionsFilters from './TransactionsFilters';
import TransactionsTable from './TransactionsTable';
import TransactionsPagination from './TransactionsPagination';

const PAGE_SIZE = 10;

function getSortingState(sort: SortOption): SortingState {
  switch (sort) {
    case 'latest':    return [{ id: 'date', desc: true }];
    case 'oldest':    return [{ id: 'date', desc: false }];
    case 'a-z':       return [{ id: 'name', desc: false }];
    case 'z-a':       return [{ id: 'name', desc: true }];
    case 'highest':   return [{ id: 'absAmount', desc: true }];
    case 'lowest':    return [{ id: 'absAmount', desc: false }];
  }
}

const nameContainsFilter: FilterFn<Transaction> = (row, columnId, filterValue: string) =>
  row.getValue<string>(columnId).toLowerCase().includes(filterValue.toLowerCase());

const exactFilter: FilterFn<Transaction> = (row, columnId, filterValue: string) =>
  row.getValue<string>(columnId) === filterValue;

const columns: ColumnDef<Transaction>[] = [
  { id: 'name',      accessorKey: 'name',      filterFn: nameContainsFilter },
  { id: 'category',  accessorKey: 'category',  filterFn: exactFilter },
  { id: 'date',      accessorKey: 'date' },
  { id: 'amount',    accessorKey: 'amount' },
  { id: 'absAmount', accessorFn: (row) => Math.abs(row.amount) },
];

export default function TransactionsClient() {
  const { data: transactions = [], isLoading, isError } = useGetTransactionsQuery();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('latest');
  const [category, setCategory] = useState('');
  const [pageIndex, setPageIndex] = useState(0);

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))).sort(),
    [transactions]
  );

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (search) filters.push({ id: 'name', value: search });
    if (category) filters.push({ id: 'category', value: category });
    return filters;
  }, [search, category]);

  const sorting = useMemo(() => getSortingState(sort), [sort]);

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: { pageIndex, pageSize: PAGE_SIZE },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: false,
    manualFiltering: false,
    manualPagination: false,
  });

  const totalPages = table.getPageCount();

  const resetPage = () => setPageIndex(0);

  const handleSearchChange = (value: string) => { setSearch(value); resetPage(); };
  const handleSortChange = (value: SortOption) => { setSort(value); resetPage(); };
  const handleCategoryChange = (value: string) => { setCategory(value); resetPage(); };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 md:p-8 animate-pulse flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 flex-1 md:flex-none md:w-80 rounded-lg bg-grey-100" />
          <div className="h-10 w-12 md:w-72 rounded-lg bg-grey-100" />
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-grey-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl p-5 md:p-8">
        <p className="text-preset-4 text-red">Failed to load transactions. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 md:p-8 flex flex-col gap-6">
      <TransactionsFilters
        search={search}
        sort={sort}
        category={category}
        categories={categories}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
      />
      <TransactionsTable table={table} />
      <TransactionsPagination
        currentPage={pageIndex + 1}
        totalPages={totalPages}
        onPageChange={(page) => setPageIndex(page - 1)}
      />
    </div>
  );
}
