import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const Profile = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState('')
    const authToken = Cookies.get('authToken')

    const fetchData = () => {
        axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/user/profile`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                withCredentials: true,
            }
        )
            .then((res) => {
                setLoading(false)
                setData(res.data.data)
                console.log("User data fetched", res);
            })
            .catch((err) => {
                console.log("Error while fetching data", err)
                setLoading(false)
            })
    }


    console.log("data", data)

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <p className='text-center font-semibold mt-3'>{loading && "Data is loading..."}</p>
            <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Name : {data.name}</h2>
                    <p className="text-gray-700 text-base mb-2">Email: {data.email}</p>
                    <p className="text-gray-700 text-base">ID: {data.id}</p>
                </div>

            </div>
        </div>
    )
}

export default Profile