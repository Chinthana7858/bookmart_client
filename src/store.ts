import { configureStore } from "@reduxjs/toolkit";
import { bookmartApi } from "./services/bookmartApi";

export const store = configureStore({
  reducer: {
    [bookmartApi.reducerPath]: bookmartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bookmartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
