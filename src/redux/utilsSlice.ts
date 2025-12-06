import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    error: null,
    success: null,
    allowPaperRegistration: false,
    bearer_token: "",
}

const utilsSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setBearerToken: (state, action: PayloadAction<string>) => {
            state.bearer_token = action.payload;
        },
        setAllowPaperRegistration: (state, action: PayloadAction<boolean>) => {
            state.allowPaperRegistration = action.payload;
        },
    },
});

export const { setLoading, setBearerToken, setAllowPaperRegistration } = utilsSlice.actions;
export default utilsSlice.reducer;