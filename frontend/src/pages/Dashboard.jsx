import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions, fetchTransactionsBySchool } from '../store/transactionsSlice'
import { FiCopy } from 'react-icons/fi';
import { FaSort } from "react-icons/fa";

// import dayjs from 'dayjs'

function useQueryState(defaults) {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    const set = (obj) => {
        const next = { ...params, ...obj };
        // remove null/empty
        Object.keys(next).forEach(k => (next[k] === undefined || next[k] === null || next[k] === '') && delete next[k]);
        setSearchParams(next);
    };
    return [params, set];
}

export default function Dashboard() {
    
    
    const [schoolId, setSchoolId] = useState('');
    const [copied, setCopied] = useState(false);
    const dispatch = useDispatch();
    const tx = useSelector(s => s.transactions);
    const dark = useSelector(s => s.ui.dark);
    const [params, setParams] = useQueryState({});
    const [localStatus, setLocalStatus] = useState((params.status || '').split(',').filter(Boolean));
    const [schoolIds, setSchoolIds] = useState((params.schools || '').split(',').filter(Boolean));
    const [from, setFrom] = useState(params.from || '');
    const [to, setTo] = useState(params.to || '');
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '10');
    const sort = params.sort || 'payment_time';
    const order = params.order || 'desc';
    
    useEffect(() => {
        // backend params
        const apiParams = {
            page, limit, sort, order
        };
        if (localStatus.length) apiParams.status = localStatus.join(',');
        if (schoolIds.length) apiParams.schools = schoolIds.join(',');
        if (from) apiParams.from = from;
        if (to) apiParams.to = to;
        dispatch(fetchTransactions(apiParams));
    }, [dispatch, page, limit, sort, order, localStatus, schoolIds, from, to]);
    
    // apply btn
    const onApplyFilters = () => {
        setParams({ status: localStatus.join(','), schools: schoolIds.join(','), from, to, page: 1 });
    };
    
    // clear btn
    const onClear = () => {
        setLocalStatus([]); setSchoolIds([]); setFrom(''); setTo('');
        setParams({});
        setSchoolId('');
    };
    
    // search btn
    const search = () => {
        console.log("clicked button")
        console.log('schoolId:', schoolId);
        if (!schoolId) return;
        dispatch(fetchTransactionsBySchool({ schoolId }));
    };


    const rows = tx.list || [];


    
    const [sortConfig, setSortConfig] = useState({
        key: "createdAt",
        direction: "asc",
    });

    // sorting logic
    const sortedTransactions = [...rows].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Handle null or undefined
        if (valueA === undefined || valueA === null) valueA = "";
        if (valueB === undefined || valueB === null) valueB = "";

        // convert numbers
        if (!isNaN(valueA) && !isNaN(valueB)) {
            valueA = Number(valueA);
            valueB = Number(valueB);
        }

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // toggle sort asc/desc
    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    // sort icon chng
    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <FaSort className="inline ml-1" />;
        return sortConfig.direction === "asc" ? (
            <SortIcon className="inline ml-1" />
        ) : (
            <SortIcon className="inline ml-1" />
        );
    };


    return (
        <div className="mt-6 w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Transactions</h1>
                <div>
                    <label className="mr-2">Page</label>
                    <select value={page} onChange={e => setParams({ page: e.target.value })} className="p-1 border rounded">
                        {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            <div className="p-4 rounded mb-4">
                <div className="flex flex-cols-3 gap-2 w-full items-center justify-start">
                    <div className={`block text-sm rounded ${dark?'bg-neutral-300 text-black':'bg-gray-300 text-black'}`}>
                        <input value={localStatus.join(',')} onChange={e => setLocalStatus(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full p-2 rounded" placeholder="Status" />
                    </div>
                    <div className={`block text-sm rounded ${dark?'bg-neutral-300 text-black':'bg-gray-300 text-black'}`}>
                        <input value={schoolId} onChange={e => setSchoolId(e.target.value)} placeholder="Enter school id" className="p-2 rounded" />
                    </div>                    
                </div>

                <div className="flex gap-2 mt-3">
                    <button onClick={onApplyFilters} className="px-3 py-1 bg-blue-600 text-white rounded">Apply</button>
                    <button onClick={search} className="px-3 py-1 bg-blue-600 text-white rounded">Search</button>
                    <button onClick={onClear} className="px-3 py-1 bg-gray-300 rounded">Clear</button>
                </div>
            </div>


            <div className="rounded p-2 text-center flex-co">
                <table className="w-full text-sm p-10">
                    <thead className='bg-gray-300 h-8'>
                        <tr className="border-b ">
                            <th onClick={() => handleSort("collect_id")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                Collect ID <SortIcon column="collect_id" />
                            </th>

                            <th onClick={() => handleSort("school_id")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                School ID <SortIcon column="school_id" />
                            </th>
                            <th onClick={() => handleSort("gateway")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                Gateway <SortIcon column="gateway" />
                            </th>
                            <th onClick={() => handleSort("order_amount")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                Order Amnt <SortIcon column="order_amount" />
                            </th>
                            <th onClick={() => handleSort("transaction_amount")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                Transaction Amnt <SortIcon column="transaction_amount" />
                            </th>
                            <th onClick={() => handleSort("status")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                Status <SortIcon column="status" />
                            </th>
                            <th onClick={() => handleSort("custom_order_id")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                Custom Order ID <SortIcon column="custom_order_id" />
                            </th>
                            <th onClick={() => handleSort("payment_url")} className={`${dark ? 'bg-neutral-300 text-black' : 'bg-gray-100 text-black'}`}>
                                Payment URL <SortIcon column="payment_url" />
                            </th>

                        </tr>
                    </thead>
                    <tbody className=''>
                        {rows.length === 0 && <tr><td colSpan="11" className="p-4">No data</td></tr>}
                        {sortedTransactions.map((r, index) => (
                            <tr key={r.collect_id} className="border-b">
                                <td className="flex items-center justify-center gap-2 p-2">
                                    <span className='w-full'>{r.collect_id}</span>

                                    <span className=''>
                                        <button title="Copy to clipboard" className='cursor-pointer mt-1 w-full'
                                            onClick={
                                                async () => {
                                                    try {
                                                        await navigator.clipboard.writeText(r.collect_id);
                                                        setCopied(r.collect_id);
                                                        alert('Copied!')
                                                        setTimeout(() => setCopied(false), 2000);
                                                    } catch (err) {
                                                        console.error("Failed to copy!", err);
                                                    }
                                                }
                                            }>
                                            <FiCopy size={18} />
                                        </button>                                        
                                    </span>
                                </td>
                                <td className='ps-0'>{r.school_id}</td>
                                <td>{r.gateway}</td>
                                <td>{r.order_amount}</td>
                                <td>{r.transaction_amount}</td>
                                <td>
                                    <span className={r.status === 'success' ? 'text-green-600 font-medium' : r.status === 'pending' ? 'text-yellow-500 font-medium' : r.status === 'failed' ? 'text-red-600 font-medium' : ''}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>{r.custom_order_id}</td>
                                <td>
                                    {r.payment_url ? (
                                        <a href={r.payment_url} rel="noopener noreferrer" target='_blank' className="text-blue-600 underline">
                                            Pay Link
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div>Showing {rows.length} of {tx.total}</div>
                <div className="space-x-2">
                    <button onClick={() => setParams({ page: Math.max(1, page - 1) })} className={`px-3 py-1 bg-gray-200 rounded ${dark?'bg-neutral-300 text-black':'bg-gray-400 text-black'}`}>Prev</button>
                    <button onClick={() => setParams({ page: page + 1 })} className={`px-3 py-1 bg-gray-200 rounded ${dark?'bg-neutral-300 text-black':'bg-gray-400 text-black'}`}>Next</button>
                </div>
            </div>
        </div>
    )
}