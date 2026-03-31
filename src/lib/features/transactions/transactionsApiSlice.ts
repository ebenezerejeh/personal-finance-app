import { apiSlice } from '@/src/lib/api/apiSlice';
import type { Transaction } from '@/src/types';

export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], void>({
      query: () => '/transactions',
      providesTags: ['Transaction'],
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionsApiSlice;
