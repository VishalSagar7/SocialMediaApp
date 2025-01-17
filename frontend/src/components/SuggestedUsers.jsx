import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { Avatar } from '@mui/material';



const SuggestedUsers = () => {

    const { suggestedUsers } = useSelector(store => store.auth);

    return (
        <div className='my-8'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer '>see all</span>
            </div>

            {
                suggestedUsers?.map((user) => {
                    return (
                        <div key={user?._id} className='flex items-center justify-between my-3'>
                            <div className='flex items-center gap-3 h-[50px]' >
                                <Link to={`/profile/${user?._id}`}>
                                    <div>
                                        <Avatar src={user?.profilePicture} />
                                    </div>
                                </Link>
                                <Link to={`/profile/${user?._id}`}>
                                    <div className='pb-2'>
                                        <h1 className='font-semibold'>{user?.username}</h1>
                                        <h1 className='text-sm text-gray-600 '>{user?.name}</h1>
                                    </div>
                                </Link>
                            </div>

                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#4a8fbc]'>Follow</span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers;
