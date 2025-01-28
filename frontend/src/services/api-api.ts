// src/services/api-api.ts

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
  export const apiApi = createApi({
    reducerPath: "apiApi",
    baseQuery: baseQueryWithReauth, // Use the custom baseQuery with reauth logic
    endpoints: (builder) => ({
      getApis: builder.query({
        query: () => "/apis", // The endpoint to fetch APIs
      }),
      createApi: builder.mutation({
        query: (newApi) => ({
          url: "/apis",
          method: "POST",
          body: newApi,
        }),
      }),
    }),
  });

export const { useGetApisQuery, useCreateApiMutation } = apiApi;
