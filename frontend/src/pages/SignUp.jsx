import React, { useState } from 'react'
import api from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from '../store/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login'

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState(null);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const dark = useSelector(s => s.ui.dark);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { email, password });
            dispatch(setToken(data.token));
            nav('/');
        } catch (error) {
            setErr(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className={`max-w-md mx-auto mt-12 p-6 rounded shadow ${dark?'bg-neutral-300 text-black':'bg-gray-100 text-black'}`}>
            <h2 className="text-xl mb-4">Signup</h2>
            {err && <div className="text-red-500 mb-2">{err}</div>}
            <form onSubmit={submit} className="space-y-3">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded " />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 rounded " />
                <button className="w-full py-2 bg-blue-600 text-white rounded">SignUp</button>
            </form>
            <p>Already have an account. <Link to="/login">Login</Link> here</p>
        </div>
    )
}
