import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StudentState = {
    newStudent: boolean;
    acca_reg: string;
    address: string;
    date_joined: string;
    dob: string;
    email: string;
    firstname: string;
    gender: "Male" | "Female" | "Other";
    lastname: string;
    papers: string[];
    partial_payment: boolean;
    phone_no: string;
    profile_pic: string;
    reg_no: string;
    terms: {
        oxford: string;
    };
    title: string;
}

export const initialState: StudentState = {
    reg_no: "",
    firstname: "",
    lastname: "",
    profile_pic: "",
    email: "",
    dob: "",
    newStudent: false,
    papers: [],
    gender: "Male",
    acca_reg: "",
    address: "",
    date_joined: "",
    partial_payment: false,
    phone_no: "",
    terms: {
        oxford: "",
    },
    title: "",
};

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setStudent: (_state, action: PayloadAction<StudentState>) => {
            return { ...action.payload };
        },
        updateStudentProfile: (state, action: PayloadAction<Partial<StudentState>>) => {
            return { ...state, ...action.payload };
        },
        clearStudent: () => initialState,
    },
});

export const {
    setStudent,
    updateStudentProfile,
    clearStudent,
} = studentSlice.actions;

export default studentSlice.reducer;