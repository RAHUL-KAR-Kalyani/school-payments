import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTransactionStatus } from '../store/transactionsSlice'

export default function CheckStatus() {
    const [id, setId] = useState('');
    const [res, setRes] = useState();
    const dispatch = useDispatch();
    const dark = useSelector(s => s.ui.dark);

    // check btn
    const check = async () => {
        try {
            const action = await dispatch(checkTransactionStatus(id));
            setRes(action.payload);
        } catch (err) {
            setRes({ error: err.message });
        }
    };

    return (
        <div className="mt-6 max-w-xl p-4 rounded">
            <h2 className="text-xl mb-3">Check Transaction Status</h2>
            <div className="flex gap-2 mb-4">
                <input value={id} onChange={e => setId(e.target.value)} placeholder="custom order id" className={`p-2 rounded w-full ${dark?'bg-neutral-300 text-black':'bg-gray-300 text-black'}`} />
                <button onClick={check} className="px-3 py-1 bg-blue-600 text-white rounded">Check</button>
            </div>

            <div className={`p-4 rounded ${dark?'bg-neutral-300 text-black':'bg-gray-100 text-black'}`}>
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(res, null, 2)}</pre>
            </div>
        </div>
    )
}
