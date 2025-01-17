import { Avatar } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useGetAllMessages from '../hooks/useGetAllMesseges';
import useGetRTM from '../hooks/useGetRTM';

const Messages = ({ selectedUser }) => {

    useGetRTM();
    useGetAllMessages();

    const { messages } = useSelector(store => store.chat);

    console.log(messages);
    
    const { user } = useSelector(store => store.auth);

    return (
        <div className=' overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>

                    <Avatar
                        sx={{ height: '5rem', width: '5rem' }}
                        src={selectedUser?.profilePicture}
                    />

                    <span>{selectedUser?.username}</span>

                    <Link
                        to={`/profile/${selectedUser?.profile}`}>
                        <button
                            className='h-8 my-2 px-4 bg-gray-100 rounded-md'>
                            View profile
                        </button>
                    </Link>
                </div>
            </div>

            <div className='flex flex-col gap-3 mt-8'>
                {
                    messages && messages?.map((msg, index) => {
                     
                       
                        return (
                            <div
                                className={`flex ${msg.senderId === user?._id ? ' justify-end ' : 'justify-start '}`}
                                key={index}
                            >
                                <div className={`flex px-3 py-1 break-words ${msg.senderId === user?._id ? 'rounded-l-full  bg-[#3796F1] text-white' : 'rounded-r-full  bg-[#EEEEEF]'}`}>
                                    { msg.message }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Messages;
