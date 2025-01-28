import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, resetTokens } from "../store/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { get } from "react-hook-form";

// Define the baseQueryWithReauth logic for token refresh
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

// Define the slice for api requests
export const apiRequestSlice = createApi({
  reducerPath: "apiRequestApi",
  baseQuery: baseQueryWithReauth, // Use baseQueryWithReauth here
  endpoints: (builder) => ({
    createApiRequest: builder.mutation({
      query: (newApiRequest) => ({
        url: "/api-requests",
        method: "POST",
        body: newApiRequest,
      }),
    }),
    getAllApiRequests: builder.query({
        query: () => "/api-requests",
      }),
  }),
});

export const { useCreateApiRequestMutation } = apiRequestSlice;
