import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { SlEye } from 'react-icons/sl'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../components/context/AuthContext'

function BlogView() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const { id } = useParams()
    const [detailsData, setDetailsData] = useState('')


    const { isAuthenticated } = useContext(AuthContext)

    const fetchDetailsData = () => {

        let url;
        if (isAuthenticated) {
            url = `${import.meta.env.VITE_API_BASE_URL}/blog/${id}/details`;
        } else {
            url = `${import.meta.env.VITE_API_BASE_URL}/blog/${id}/details/public`;
        }

        axios.post(url, {}, { withCredentials: true })
            .then((res) => {
                setDetailsData(res.data)
                console.log("details data fetched", res);
            })
            .catch((err) => {
                console.log("Error while fetch details data", err)

            })
    }
    const fetchData = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/blogs/${id}`, {}, { withCredentials: true })
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

    const viewCountAPI = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}/view-count`, {}, { withCredentials: true })
    }

    useEffect(() => {
        viewCountAPI();
        fetchDetailsData()
        fetchData();
    }, [])

    const handleLike = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}/like`, {}, { withCredentials: true })
            .then((res) => {
                fetchDetailsData();
                console.log("User liked", res);
                toast("You Liked!")
            })
            .catch((err) => {
                console.log("Error while liking", err)
            })
    }

    const handleDislike = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}/dislike`, {}, { withCredentials: true })
            .then((res) => {
                console.log("User Disliked", res);
                fetchDetailsData();
                toast("You Disliked!")
            })
            .catch((err) => {
                console.log("Error while liking", err)
            })
    }


    return (
        <div className="flex p-4">
            <div
                className="p-6 m-2 max-w-fit bg-white transition-transform transform"
            >
                {data ? (
                    <>
                        {data?.image && (
                            <img
                                src={data.image}
                                alt={data.title || "Blog Image"}
                                className="w-full max-h-96 object-cover rounded-md mb-4"
                            />
                        )}
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{data?.title}</h2>
                        <div className="flex space-x-4 my-3">
                            <div
                                onClick={handleLike}
                                className={`flex items-center space-x-2 p-2 border rounded-md cursor-pointer transition 
                                    ${detailsData?.userLiked ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'}
                                    ${detailsData?.userLiked ? 'hover:bg-green-600' : 'hover:bg-gray-200'}`}
                            >
                                <AiOutlineLike className={`text-lg ${detailsData?.userLiked ? 'text-white' : 'text-gray-500'}`} />
                                <span className={`transition-colors duration-300 ${detailsData?.userLiked ? 'font-semibold' : ''}`}>Like</span>
                                <span className={`text-gray-500 ${detailsData?.userLiked ? 'text-white' : 'text-gray-700'}`}>{detailsData?.likes}</span>
                            </div>

                            <div
                                onClick={handleDislike}
                                className={`flex items-center space-x-2 p-2 border rounded-md cursor-pointer transition
                                    ${detailsData?.userDisliked ? 'bg-red-500 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}
                                    ${detailsData?.userDisliked ? 'hover:bg-red-600' : 'hover:bg-gray-100'}`}
                            >
                                <AiOutlineDislike className={`text-lg ${detailsData?.userDisliked ? 'text-white' : 'text-gray-500'}`} />
                                <span className={`transition-colors duration-300 ${detailsData?.userDisliked ? 'font-semibold' : ''}`}>Dislike</span>
                                <span className={`text-gray-500 ${detailsData?.userDisliked ? 'text-white' : 'text-gray-700'}`}>{detailsData?.dislikes}</span>
                            </div>

                            <div className="group flex items-center space-x-2 p-2 border border-gray-300 hover:border-gray-400 rounded-md cursor-pointer transition">
                                <SlEye className="text-gray-500 group-hover:text-green-500" />
                                <span className="transition-colors duration-300">View</span>
                                <span className="text-gray-500">{detailsData?.views}</span>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-4">{data?.content}</p>
                        <p className="text-gray-500 text-sm mb-2">Author: {data?.author?.name}</p>
                        <p className="text-gray-400 text-xs">{new Date(data?.updatedAt).toLocaleDateString()}</p>
                    </>
                ) : (
                    <p>Blog not found</p>
                )}
            </div>
        </div>
    );

}

export default BlogView