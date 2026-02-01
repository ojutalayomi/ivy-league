import { AdminModeEnum } from '@/providers/user-provider';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
    blocked: boolean;
    role: AdminModeEnum | null;
    email: string;
    firstname: string;
    gender: string;
    lastname: string;
    title: string;
    user_status: 'signee' | 'student' | 'staff';
    reg_no: string;
    acca_reg: string;
    dob: string;
    phone_no: string;
    profile_pic: string;
    address: string;
    signed_in: boolean;
    email_verified: boolean;
    fee: {
        amount: number;
        reason: string;
    }[];
    scholarship: [][],
    /**
     * Example:
     * ```json
     * [
     *  {
     *      "BT": ["Business And Technology", "2026 September Diet"]
     *  },
     *  {
     *      "MA": ["Management Accounting", "2026 July Diet"]
     *  }
     * ]
     * ```
     */
    papers: {
        [code: string]: string[];
    }[]
}

export const initialState: UserState = {
    blocked: false,
    role: null,
    email: "",
    firstname: "",
    gender: "",
    lastname: "",
    title: "",
    user_status: "signee",
    reg_no: "",
    acca_reg: "001",
    dob: "",
    phone_no: "",
    profile_pic: "",
    address: "",
    signed_in: false,
    email_verified: false,
    fee: [],
    scholarship: [],
    papers: []
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