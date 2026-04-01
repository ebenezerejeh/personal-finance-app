import { apiSlice } from '@/src/lib/api/apiSlice';
import type { Pot } from '@/src/types';

const potsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPots: builder.query<Pot[], void>({
      query: () => '/pots',
      providesTags: ['Pot'],
    }),
  }),
});

export const { useGetPotsQuery } = potsApiSlice;
