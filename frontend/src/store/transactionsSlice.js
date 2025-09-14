// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../utils/api';

// // fetch transactions with query params object
// export const fetchTransactions = createAsyncThunk(
//     'transactions/fetch',
//     async (params) => {
//         // params -> { page, limit, sort, order, status, schools, fromDate, toDate, search }
//         const resp = await api.get('/transactions', { params });
//         return resp.data;
//     }
// );

// export const fetchTransactionsBySchool = createAsyncThunk(
//     'transactions/fetchBySchool',
//     async ({ schoolId, page = 1, limit = 10 }) => {
//         const resp = await api.get(`/transactions/school/${schoolId}`, { params: { page, limit } });
//         return resp.data;
//     }
// );

// export const checkTransactionStatus = createAsyncThunk(
//     'transactions/checkStatus',
//     async (custom_order_id) => {
//         const resp = await api.get(`/transactions/transaction-status/${custom_order_id}`);
//         return resp.data;
//     }
// );

// const slice = createSlice({
//     name: 'transactions',
//     initialState: {
//         list: [],
//         page: 1,
//         limit: 10,
//         total: 0,
//         loading: false,
//         lastParams: {}
//     },
//     reducers: {},
//     extraReducers: builder => {
//         builder

//             // for fetchTransactions

//             .addCase(fetchTransactions.pending, (s) => { s.loading = true })
//             .addCase(fetchTransactions.fulfilled, (s, a) => {
//                 s.loading = false;
//                 s.list = a.payload.data || [];
//                 s.page = a.payload.page || 1;
//                 s.limit = a.payload.limit || 10;
//                 s.total = a.payload.total || 0;
//                 s.lastParams = a.meta.arg;
//             })
//             .addCase(fetchTransactions.rejected, (s) => { s.loading = false })

//             //for fetchTransactionsBySchool

//             .addCase(fetchTransactionsBySchool.pending, (s) => { s.loading = true })
//             .addCase(fetchTransactionsBySchool.fulfilled, (s, a) => {
//                 s.loading = false;
//                 s.list = a.payload.data || [];
//                 s.page = a.payload.page || 1;
//                 s.limit = a.payload.limit || 10;
//                 s.total = a.payload.total || 0;
//                 s.lastParams = a.meta.arg;
//             })
//             .addCase(fetchTransactionsBySchool.rejected, (s) => { s.loading = false })

//         //for checkTransactionStatus
//     }
// });

// export default slice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// fetch transactions with query params object
export const fetchTransactions = createAsyncThunk(
    'transactions/fetch',
    async (params) => {
        // params -> { page, limit, sort, order, status, schools, fromDate, toDate, search }
        const resp = await api.get('/transactions', { params });
        return resp.data;
    }
);

export const fetchTransactionsBySchool = createAsyncThunk(
    'transactions/fetchBySchool',
    async ({ schoolId, page = 1, limit = 10 }) => {
        const resp = await api.get(`/transactions/school/${schoolId}`, { params: { page, limit } });
        return resp.data;
    }
);

export const checkTransactionStatus = createAsyncThunk(
    'transactions/checkStatus',
    async (custom_order_id) => {
        const resp = await api.get(`/transactions/transaction-status/${custom_order_id}`);
        return resp.data;
    }
);



export const createPayment = createAsyncThunk(
    'transactions/createPayment',
    async (payload) => {
        const resp = await api.post('/create-payment', payload);
        return resp.data;
    }
);




const slice = createSlice({
    name: 'transactions',
    initialState: {
        list: [],
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        lastParams: {},
        error: null, // 🔹 added error state for payments
    },
    reducers: {},
    extraReducers: builder => {
        builder

            // for fetchTransactions
            .addCase(fetchTransactions.pending, (s) => { s.loading = true })
            .addCase(fetchTransactions.fulfilled, (s, a) => {
                s.loading = false;
                // ensure every txn has payment_url field initialized
                s.list = (a.payload.data || []).map(txn => ({
                    ...txn,
                    payment_url: txn.payment_url || null
                }));
                s.page = a.payload.page || 1;
                s.limit = a.payload.limit || 10;
                s.total = a.payload.total || 0;
                s.lastParams = a.meta.arg;
            })
            .addCase(fetchTransactions.rejected, (s) => { s.loading = false })

            // for fetchTransactionsBySchool
            .addCase(fetchTransactionsBySchool.pending, (s) => { s.loading = true })
            .addCase(fetchTransactionsBySchool.fulfilled, (s, a) => {
                s.loading = false;
                s.list = (a.payload.data || []).map(txn => ({
                    ...txn,
                    payment_url: txn.payment_url || null
                }));
                s.page = a.payload.page || 1;
                s.limit = a.payload.limit || 10;
                s.total = a.payload.total || 0;
                s.lastParams = a.meta.arg;
            })
            .addCase(fetchTransactionsBySchool.rejected, (s) => { s.loading = false })            

            // 🔹 NEW: handle createPayment
            .addCase(createPayment.pending, (s) => {
                s.loading = true;
                s.error = null;
            })           
            .addCase(createPayment.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload;
            }).addCase(createPayment.fulfilled, (s, a) => {
                s.payment_url = a.payload.payment_url;
                s.currentCustomOrderId = a.payload.custom_order_id;
            });

    }
});

export default slice.reducer;

