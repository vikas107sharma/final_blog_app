import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from './context/AuthContext'

function Header() { 
    const navigate = useNavigate()

    const { setIsAuthenticated, isAuthenticated, myData } = useContext(AuthContext)

    const handleLogout = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, {}, { withCredentials: true })
            .then((res) => {
                setIsAuthenticated(false)
                toast("Logout Successful");
                console.log("User logout success", res);
            })
            .catch((err) => {
                console.log("Error while logout", err)
            })
        navigate('/login')
    }


    return (
        <div className='border border-b bg-white h-14 flex justify-between px-5 items-center'>
            <div className="flex gap-5">
                <Link
                    to="/"
                    className="text-gray-800 hover:text-blue-500 font-medium transition-colors"
                >
                    Home
                </Link>
                <Link
                    to="/profile"
                    className="text-gray-800 hover:text-blue-500 font-medium transition-colors"
                >
                    Profile
                </Link>
            </div>


            {isAuthenticated ? (
                <div className="flex items-center gap-5">
                    <p className="text-gray-600 font-sm">{myData?.name}</p>
                    <p className="text-gray-600 text-sm">{myData?.email}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded shadow-md transition-all"
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <div className="flex gap-5 ml-auto">
                    <Link
                        to="/login"
                        className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="text-green-500 hover:text-green-600 font-medium transition-colors"
                    >
                        Register
                    </Link>
                </div>

            )}
        </div>


    )
}

export default Header