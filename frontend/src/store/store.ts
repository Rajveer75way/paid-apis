import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";
import { api } from "../services/user-api";
import { planApiSlice } from "../services/plan-api";
import {apiApi} from "../services/api-api";
import { apiRequestSlice } from "../services/api-request";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [planApiSlice.reducerPath]: planApiSlice.reducer,
    [apiApi.reducerPath]: apiApi.reducer,
    [apiRequestSlice.reducerPath]: apiRequestSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, planApiSlice.middleware, apiApi.middleware,apiRequestSlice.middleware), // Add planApiSlice.middleware here
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
