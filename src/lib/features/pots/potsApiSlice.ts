import { apiSlice } from '@/src/lib/api/apiSlice';
import type { Pot } from '@/src/types';

const potsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPots: builder.query<Pot[], void>({
      query: () => '/pots',
      providesTags: ['Pot'],
    }),

    addPot: builder.mutation<Pot, Pot>({
      query: (pot) => ({
        url: '/pots',
        method: 'POST',
        body: pot,
      }),
      async onQueryStarted(pot, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData('getPots' as never, undefined, (draft: Pot[]) => {
            draft.push(pot);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    updatePot: builder.mutation<Pot, Pot>({
      query: (pot) => ({
        url: '/pots',
        method: 'PATCH',
        body: pot,
      }),
      async onQueryStarted(pot, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData('getPots' as never, undefined, (draft: Pot[]) => {
            const idx = draft.findIndex((p) => p.name === pot.name);
            if (idx !== -1) draft[idx] = pot;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    deletePot: builder.mutation<void, string>({
      query: (name) => ({
        url: '/pots',
        method: 'DELETE',
        body: { name },
      }),
      async onQueryStarted(name, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData('getPots' as never, undefined, (draft: Pot[]) => {
            const idx = draft.findIndex((p) => p.name === name);
            if (idx !== -1) draft.splice(idx, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    addToPot: builder.mutation<void, { name: string; amount: number }>({
      query: (body) => ({
        url: '/pots',
        method: 'PATCH',
        body,
      }),
      async onQueryStarted({ name, amount }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData('getPots' as never, undefined, (draft: Pot[]) => {
            const pot = draft.find((p) => p.name === name);
            if (pot) pot.total = Math.min(pot.target, pot.total + amount);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    withdrawFromPot: builder.mutation<void, { name: string; amount: number }>({
      query: (body) => ({
        url: '/pots',
        method: 'PATCH',
        body,
      }),
      async onQueryStarted({ name, amount }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData('getPots' as never, undefined, (draft: Pot[]) => {
            const pot = draft.find((p) => p.name === name);
            if (pot) pot.total = Math.max(0, pot.total - amount);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPotsQuery,
  useAddPotMutation,
  useUpdatePotMutation,
  useDeletePotMutation,
  useAddToPotMutation,
  useWithdrawFromPotMutation,
} = potsApiSlice;
