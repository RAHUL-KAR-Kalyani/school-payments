import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';
// import paymentReducer from "./paymentSlice";
import authReducer from './authSlice';
import uiReducer from './uiSlice';

const store = configureStore({
	reducer: {
		transactions: transactionsReducer,
		// payment: paymentReducer,
		auth: authReducer,
		ui: uiReducer
	}
});

export default store;
