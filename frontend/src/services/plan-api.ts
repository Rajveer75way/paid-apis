// src/features/plans/slices/planApiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const planApiSlice = createApi({
  reducerPath: "planApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/plans",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/",
    }),
    createPlan: builder.mutation({

      query: (newPlan) => ({
        url: "/",
        method: "POST",
        body: newPlan,
      }),
    }),
  }),
});

export const { useGetPlansQuery, useCreatePlanMutation } = planApiSlice;
