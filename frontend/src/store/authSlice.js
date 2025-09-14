import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token') || null;

const slice = createSlice({
    name: 'auth',
    initialState: { token, user: null },
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
            if (action.payload) localStorage.setItem('token', action.payload);
            else localStorage.removeItem('token');
        },
        setUser(state, action) { state.user = action.payload; }
    }
});

export const { setToken, setUser } = slice.actions;
export default slice.reducer;
