import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function BlogList() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    const fetchData = () => {
        setLoading(true);
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/my-posts`, {}, { withCredentials: true })
            .then((res) => {
                setLoading(false);
                setData(res.data);
                console.log("User blog post", res);
            })
            .catch((err) => {
                console.log("Error while fetch data", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id) => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/blog/delete-post/${id}`, { withCredentials: true })
            .then((res) => {
                toast("Post Deleted");
                fetchData();
                console.log("blog post deleted", res);
            })
            .catch((err) => {
                toast("Something went wrong");
                console.log("Error while delete data", err);
            });
    };

    const handleEdit = (id) => {
        navigate(`/edit-blog/${id}`);
        console.log(id);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">User's Blog Posts</h1>
            <div className="overflow-x-auto">
                {
                    data?.length === 0 ?
                        <p>No Blog Post Found!</p>
                        :
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">SL.</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Image</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Title</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Content</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((blog, i) => (
                                    <tr key={blog._id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-800">{i + 1}</td>
                                        <td className="py-3 px-4">
                                            {blog.image && (
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-gray-800">{blog.title}</td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {blog.content.substring(0, 60)}
                                            {blog.content.length > 60 && '...'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="text-gray-500 flex gap-2 items-center mt-8 justify-center">
                                            <button onClick={() => handleDelete(blog._id)}>
                                                <MdOutlineDeleteForever color='red' size={20} />
                                            </button>
                                            <button onClick={() => handleEdit(blog._id)}>
                                                <FiEdit color='blue' size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                }
            </div>
        </div>
    );
}

export default BlogList;
