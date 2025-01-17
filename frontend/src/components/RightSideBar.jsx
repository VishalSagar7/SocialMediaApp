import React from 'react'
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers';

const RightSideBar = () => {

    const { user } = useSelector(store => store.auth);

    return (
        <div className=' my-10 pr-32 lg:w-[28%] '>
            
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

            <SuggestedUsers />
            
        </div>
    )
};

export default RightSideBar;
