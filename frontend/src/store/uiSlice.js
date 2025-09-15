import { createSlice } from '@reduxjs/toolkit';

const initialDark = localStorage.getItem('dark') === 'true';

const slice = createSlice({
    name: 'ui',
    initialState: { dark: initialDark },
    reducers: {        
        toggleDark(state) {
            state.dark = !state.dark;
            localStorage.setItem('dark', state.dark);
            if (state.dark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        setDark(state, action) {
            state.dark = action.payload;
            localStorage.setItem('dark', state.dark);
            if (state.dark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }
});

export const { toggleDark, setDark } = slice.actions;
export default slice.reducer;
