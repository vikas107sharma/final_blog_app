import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const navigate = useNavigate()

    const fetchData = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/blogs`, {}, { withCredentials: true })
            .then((res) => {
                setLoading(false)
                setData(res.data)
                console.log("User data fetched", res);
            })
            .catch((err) => {
                console.log("Error while fetching data", err)
                setLoading(false)
            })
    }    

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="flex flex-wrap justify-center gap-4 p-4 cursor-pointer">
            {data?.map((item, index) => (
                <div
                    onClick={() => navigate(`/${item?._id}`)}
                    key={index}
                    className="border border-gray-200 shadow-md rounded-lg p-6 m-2 max-w-sm bg-white transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-50"
                >
                    {item?.image && (
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                    )}
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">{item?.title}</h2>
                    <p className="text-gray-600 mb-4">{item?.content?.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm">Author: {item?.author?.name}</p>
                        <p className="text-gray-400 text-xs">{new Date(item?.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Home