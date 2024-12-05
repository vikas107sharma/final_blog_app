import React from 'react'
import { CgProfile } from 'react-icons/cg'
import { CiViewList } from 'react-icons/ci'
import { FiUser } from 'react-icons/fi'
import { IoCreateOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

    const navigate = useNavigate()

    return (
        <div className='bg-white h-screen border-r'>
            <div className='space-y-5 py-5 px-3'>

                <div onClick={()=>navigate('/create-blog')} className='flex items-center hover:bg-gray-200 rounded p-2 cursor-pointer space-x-2'>
                    <IoCreateOutline size={20} color='blue' />
                    <p className='font-semibold text-gray-700'>Create Blog</p>
                </div>
                <div onClick={()=>navigate('/blog-list')} className='flex items-center hover:bg-gray-200 rounded p-2 cursor-pointer space-x-2'>
                    <CiViewList size={20} color='blue' />
                    <p className='font-semibold text-gray-700'>Blog List</p>
                </div>
                <div onClick={()=>navigate('/profile')} className='flex items-center hover:bg-gray-200 rounded p-2 cursor-pointer space-x-2'>
                    <FiUser size={20} color='blue' />
                    <p className='font-semibold text-gray-700'>Profile</p>
                </div>


            </div>
        </div>
    )
}

export default Sidebar