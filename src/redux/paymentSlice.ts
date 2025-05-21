import { User } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {} as User;

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPayment: (_state, action: PayloadAction<User>) => {
            return { ...action.payload };
        },
        updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
            return { ...state, ...action.payload };
        },
        updatePreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        updateVerificationStatus: (state, action: PayloadAction<Partial<User['verificationStatus']>>) => {
            state.verificationStatus = { ...state.verificationStatus, ...action.payload };
        },
        updateAccountDetails: (state, action: PayloadAction<Partial<User['accountDetails']>>) => {
            state.accountDetails = { ...state.accountDetails, ...action.payload };
        },
        updatePaymentDetails: (state, action: PayloadAction<Partial<User['paymentDetails']>>) => {
            state.paymentDetails = { ...state.paymentDetails, ...action.payload };
        },
        clearUser: () => initialState,
    },
});

export const {
    setPayment,
    updateUserProfile,
    updatePreferences,
    updateVerificationStatus,
    updateAccountDetails,
    updatePaymentDetails,
    clearUser,
} = paymentSlice.actions;

export default paymentSlice.reducer;