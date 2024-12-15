import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/lib/types';

const initialState: User = {} as User;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<User>) => {
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
    setUser,
    updateUserProfile,
    updatePreferences,
    updateVerificationStatus,
    updateAccountDetails,
    updatePaymentDetails,
    clearUser,
} = userSlice.actions;

export default userSlice.reducer;