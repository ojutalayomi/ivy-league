import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import paymentReducer from './paymentSlice'
import utilsReducer from './utilsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    utils: utilsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;