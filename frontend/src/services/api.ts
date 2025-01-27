import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, resetTokens } from "../store/reducers/authReducer";
import { LoginRequest, LoginResponse, User } from "../types";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/users/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = (
          refreshResult.data as LoginResponse
        ).data.tokens;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(resetTokens());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        const navigate = useNavigate();
        navigate("/login"); // Use navigate to redirect to login page
      }
    } else {
      api.dispatch(resetTokens());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      const navigate = useNavigate();
      navigate("/login"); // Use navigate to redirect to login page
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signup : builder.mutation<void, User>({
      query: (credentials) => ({
        url: "/users/",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data && data.data && data.data.data.tokens) {
            const { accessToken, refreshToken } = data.data.data.tokens;
            console.log(accessToken, refreshToken);
            dispatch(setTokens({ accessToken, refreshToken }));
          } else {
            console.error("Tokens missing in the response");
          }
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: (_, { dispatch }) => {
        dispatch(resetTokens());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      },
    }),
    getAllExpenses: builder.query<any, void>({
      query: () => ({
        url: "/expenses",
        method: "GET",
      }),
      extraOptions: { requiresAuth: false },
    }),
    refreshAccessToken: builder.mutation({
      query: () => ({
        url: "/users/refresh-token",
        method: "POST",
        body: { refreshToken: localStorage.getItem("refreshToken") },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetAllExpensesQuery,
  useRefreshAccessTokenMutation,
  useSignupMutation,
} = api;
