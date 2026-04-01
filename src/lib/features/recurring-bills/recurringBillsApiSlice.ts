import { apiSlice } from '@/src/lib/api/apiSlice';
import type { Transaction } from '@/src/types';

export const recurringBillsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecurringBills: builder.query<Transaction[], void>({
      query: () => '/recurring-bills',
      providesTags: ['RecurringBill'],
    }),
  }),
});

export const { useGetRecurringBillsQuery } = recurringBillsApiSlice;
