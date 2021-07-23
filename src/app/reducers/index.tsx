import {
  configureStore, ThunkAction, Action, getDefaultMiddleware
} from "@reduxjs/toolkit";
import layoutReducer from "./layout";

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;