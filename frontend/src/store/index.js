import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

const store = configureStore({
	reducer: {
		transactions: transactionsReducer,
		auth: authReducer,
		ui: uiReducer
	}
});

export default store;
