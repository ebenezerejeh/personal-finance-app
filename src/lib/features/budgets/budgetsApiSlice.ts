import { apiSlice } from '@/src/lib/api/apiSlice';
import type { Budget } from '@/src/types';

const budgetsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => '/budgets',
      providesTags: ['Budget'],
    }),
  }),
});

export const { useGetBudgetsQuery } = budgetsApiSlice;
