import { apiSlice } from '@/src/lib/api/apiSlice';
import type { Balance, Budget, Pot, Transaction } from '@/src/types';

export interface OverviewResponse {
  balance: Balance;
  pots: Pot[];
  budgets: Budget[];
  recentTransactions: Transaction[];
  allTransactions: Transaction[];
  recurringBills: Transaction[];
}

export const overviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<OverviewResponse, void>({
      query: () => '/overview',
      providesTags: ['Overview'],
    }),
  }),
});

export const { useGetOverviewQuery } = overviewApiSlice;
