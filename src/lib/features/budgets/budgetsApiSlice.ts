import { apiSlice } from '@/src/lib/api/apiSlice';
import type { Budget } from '@/src/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateBudgetsCache = (apiSlice.util.updateQueryData as any).bind(apiSlice.util, 'getBudgets', undefined);

const budgetsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => '/budgets',
      providesTags: ['Budget'],
    }),

    addBudget: builder.mutation<Budget, Budget>({
      query: (budget) => ({
        url: '/budgets',
        method: 'POST',
        body: budget,
      }),
      async onQueryStarted(budget, { dispatch, queryFulfilled }) {
        const patch = dispatch(updateBudgetsCache((draft: Budget[]) => { draft.push(budget); }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),

    updateBudget: builder.mutation<Budget, Budget>({
      query: (budget) => ({
        url: '/budgets',
        method: 'PATCH',
        body: budget,
      }),
      async onQueryStarted(budget, { dispatch, queryFulfilled }) {
        const patch = dispatch(updateBudgetsCache((draft: Budget[]) => {
          const idx = draft.findIndex((b) => b.category === budget.category);
          if (idx !== -1) draft[idx] = budget;
        }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),

    deleteBudget: builder.mutation<void, string>({
      query: (category) => ({
        url: '/budgets',
        method: 'DELETE',
        body: { category },
      }),
      async onQueryStarted(category, { dispatch, queryFulfilled }) {
        const patch = dispatch(updateBudgetsCache((draft: Budget[]) => {
          const idx = draft.findIndex((b) => b.category === category);
          if (idx !== -1) draft.splice(idx, 1);
        }));
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useAddBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetsApiSlice;
