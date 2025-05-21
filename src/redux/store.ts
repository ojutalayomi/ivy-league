import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import paymentReducer from './paymentSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;