import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from './context/AuthContext';
import Sidebar from './Sidebar';

const ProtectedRoute = () => {
    const { myData, isAuthenticated, loading } = useContext(AuthContext)

    console.log("myData, isAuthenticated, loading ", myData, isAuthenticated, loading)

    return isAuthenticated ?
        <div className='grid grid-cols-12'>
            <div className='col-span-2'>
                <Sidebar />
            </div>
            <div className='col-span-10'>
                <Outlet />
            </div>
        </div>
        : <Navigate to="login" />
}

export default ProtectedRoute