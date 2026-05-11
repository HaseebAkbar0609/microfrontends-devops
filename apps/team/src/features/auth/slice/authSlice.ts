import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
	isAuthenticated: boolean;
};

const initialState: AuthState = {
	isAuthenticated: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
});

export default authSlice.reducer;
