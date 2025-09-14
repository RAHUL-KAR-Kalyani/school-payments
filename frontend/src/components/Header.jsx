import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDark } from '../store/uiSlice'
import { setToken } from '../store/authSlice'

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dark = useSelector(s => s.ui.dark);
    const token = useSelector(s => s.auth.token);

    const handleLogout = () => {
        dispatch(setToken(null));
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup')
    }

    const handleLogin = () => {
        navigate('/login');
    };

    const handleToggleDark = () => {
        dispatch(toggleDark());
    };

    return (
        <header className="shadow-sm w-full bg-gray-700 text-white">
            <div className="container flex items-center justify-between py-4">
                <div className="flex items-center space-x-6">
                    <Link to="/" className="font-bold text-lg">School Payments</Link>
                    <Link to="/" className="text-sm">Dashboard</Link>
                    <Link to="/school" className="text-sm">By School</Link>
                    <Link to="/check-status" className="text-sm">Check Status</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => handleToggleDark()} className={`px-3 py-1 rounded bg-gray-700 text-white`} aria-label={`Switch to ${dark ? 'dark' : 'light'} mode`}>
                        {!dark ? 'Dark' : 'Light'}
                    </button>

                    {
                        /* <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white">{token ? 'Logout' : 'Login'}</button>
                        <button onClick={()=>handleSignup()} className="px-3 py-1 rounded bg-red-500 text-white">{!token?'Signup':'' }</button> */
                    }

                    {token ? (
                        <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-500 text-white">
                            Logout
                        </button>
                    ) : (
                        <>
                            <button onClick={handleLogin} className="px-3 py-1 rounded bg-red-500 text-white">
                                Login
                            </button>
                            <button onClick={handleSignup} className="px-3 py-1 rounded bg-blue-500 text-white ml-2">
                                Signup
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
