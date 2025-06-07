import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    error: null,
    success: null,
    allowPaperRegistration: false,
}

const utilsSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setAllowPaperRegistration: (state, action: PayloadAction<boolean>) => {
            state.allowPaperRegistration = action.payload;
        },
    },
});

export const { setLoading, setAllowPaperRegistration } = utilsSlice.actions;
export default utilsSlice.reducer;