import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactionsBySchool } from '../store/transactionsSlice'
import { FiCopy } from 'react-icons/fi';

export default function SchoolTransactions() {
    const [schoolId, setSchoolId] = useState('');
    const [copied, setCopied] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const dispatch = useDispatch();
    const { list } = useSelector(s => s.transactions);
    const dark = useSelector(s => s.ui.dark);

    // search btn
    const search = () => {
        console.log("clicked button")
        console.log('schoolId:', schoolId);
        if (!schoolId) return;
        dispatch(fetchTransactionsBySchool({ schoolId }));
    };


    // filter list on status
    const filteredList = list.filter(r => {
        if (!statusFilter) return true;
        return r.status.toLowerCase() === statusFilter.toLowerCase();
    });



    return (
        <div className="mt-6">
            <h2 className="text-xl mb-3">Transactions by School</h2>
            <div className="flex gap-2 mb-4">
                <input value={schoolId} onChange={e => setSchoolId(e.target.value)} placeholder="Enter school id" className={`p-2 rounded ${dark?'bg-neutral-300 text-black':'bg-gray-300 text-black'}`} />
                <button onClick={search} className="px-3 py-1 bg-blue-600 text-white rounded">Search</button>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`p-2 rounded ${dark?'bg-neutral-300 text-black':'bg-gray-300 text-black'}`} >
                    <option value="" disabled selected>
                        Filter Status
                    </option>
                    <option value="" className='bg-gray-500'>All</option>
                    <option value="Success" className='bg-gray-500'>Success</option>
                    <option value="Pending" className='bg-gray-500'>Pending</option>
                    <option value="Failed" className='bg-gray-500'>Failed</option>
                </select>
            </div>

            <div className="p-3 rounded text-center">
                <table className="w-full text-sm">
                    <thead className='h-8'>
                        <tr className="border-b">
                            <th>School Id</th>
                            <th>Collect ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.map(r => (
                            <tr key={r.collect_id} className="border-b">
                                <td className="flex items-center justify-center gap-2 p-2">
                                    <span className='w-fit'>{r.school_id}</span>
                                    <span className=''>
                                        <button title="Copy to clipboard" className='cursor-pointer mt-1'
                                            onClick={
                                                async () => {
                                                    try {
                                                        await navigator.clipboard.writeText(r.school_id);
                                                        setCopied(r.school_id);
                                                        alert('Copied!')
                                                        setTimeout(() => setCopied(false), 100);
                                                    } catch (err) {
                                                        console.error("Failed to copy!", err);
                                                    }
                                                }
                                            }
                                        >
                                            <FiCopy size={18} />
                                        </button>
                                    </span>

                                </td>
                                <td>{r.collect_id}</td>
                                <td>{r.order_amount}</td>
                                <td>
                                    <span className={r.status === 'success' ? 'text-green-600 font-medium' : r.status === 'pending' ? 'text-yellow-500 font-medium' : r.status === 'failed' ? 'text-red-600 font-medium' : ''}>
                                        {r.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
