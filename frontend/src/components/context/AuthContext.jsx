import axios from "axios";
import { createContext, useEffect, useState } from "react";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [data, setData] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    const fetchDat = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {}, { withCredentials: true })
            .then((res) => {
                if (res.data.status) {
                    setData(res.data.data)
                    setIsAuthenticated(res.data.status)
                    console.log("Data in Authcontext", res)
                    setLoading(false)
                } else {
                    setIsAuthenticated(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log("Error while fetching profile data", err)
            })
    }


    const myData = {
        name: data?.name,
        email: data?.email
    }


    useEffect(() => {
        fetchDat()
    }, [])


    return (
        <AuthContext.Provider value={{ myData, isAuthenticated, loading, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )

}

export { AuthContext, AuthProvider }