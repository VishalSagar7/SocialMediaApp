import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';


const Notifications = () => {

    const { likeNotification } = useSelector(store => store.realTimeNotification);

    return (
        <div className='flex flex-col gap-3 max-w-xl mx-auto  my-4'>
            {
                likeNotification.length === 0 ? (<p>No new notification</p>) : (
                    likeNotification?.map((notification) => {
                        return (
                            <div
                                className='flex items-center gap-2'
                                key={notification.userId}>
                                <Avatar sx={{ height: '35px', width: '35px' }} src={notification?.userDetails?.profilePicture} />
                                <p className='text-sm'><span className='font-bold'>{notification?.userDetails?.username}</span> Liked your post</p>
                                <div className='h-[35px] w-[35px] flex ml-auto'>
                                    <img className=' h-full w-full' src={notification?.postImg } alt='post-img' />
                                </div>
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}

export default Notifications;
