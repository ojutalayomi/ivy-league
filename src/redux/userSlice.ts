import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
    email: string;
    firstname: string;
    gender: string;
    lastname: string;
    title: string;
    user_status: 'signee' | 'student' | '';
    reg_no: string;
    acca_reg: string;
    dob: string;
    phone_no: string;
    address: string;
    signed_in: boolean;
}

const initialState: UserState = {
    email: "",
    firstname: "",
    gender: "",
    lastname: "",
    title: "",
    user_status: "",
    reg_no: "",
    acca_reg: "",
    dob: "",
    phone_no: "",
    address: "",
    signed_in: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<UserState>) => {
            return { ...action.payload };
        },
        updateUserProfile: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
        clearUser: () => initialState,
    },
});

export const {
    setUser,
    updateUserProfile,
    clearUser,
} = userSlice.actions;

export default userSlice.reducer;