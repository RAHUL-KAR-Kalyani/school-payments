import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SchoolTransactions from './pages/SchoolTransactions'
import CheckStatus from './pages/CheckStatus'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import { useSelector } from 'react-redux'

export default function App() {
	const token = useSelector(s => s.auth.token);
	const dark = useSelector(s => s.ui.dark);

	useEffect(() => {
		if (dark) {
			document.documentElement.classList.add('bg-gray-900', 'text-white');
			document.documentElement.classList.remove('bg-gray-100', 'text-gray-900');
		} else {
			document.documentElement.classList.add('bg-gray-100', 'text-gray-900');
			document.documentElement.classList.remove('bg-gray-900', 'text-white');
		}
	}, [dark]);



	//
	return (
		// <div className={useSelector(s => s.ui.dark) ? 'dark' : ''}>
		<div className="min-h-screen">
			<Header />
			<main className="container">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
					<Route path="/school" element={token ? <SchoolTransactions /> : <Navigate to="/login" />} />
					<Route path="/check-status" element={token ? <CheckStatus /> : <Navigate to="/login" />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</main>
		</div>
		// </div>
	)
}
