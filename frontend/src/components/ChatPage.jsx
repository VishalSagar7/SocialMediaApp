import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/authSlice';
import { LuMessageCircleCode } from "react-icons/lu";
import Messages from './Messages';
import axios from 'axios'
import { API_ENDPOINT } from '../../utils/constants'
import { setMessages } from '../redux/chatSlice';
import { IoSend } from "react-icons/io5";



const ChatPage = () => {

    const [textMessage, setTextMessage] = useState('');
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    // const isOnline = false;
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`${API_ENDPOINT}/api/v1/message/send/${receiverId}`, {textMessage}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                
                const newMessageArray = messages;

  
                dispatch(setMessages([...messages, res?.data?.newMessage]));
                setTextMessage('');
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    },[])


    return (
        <div className='flex ml-[16%] min-w-[200px] h-screen ' >
            <section className=' w-full md:w-1/4 mb-4'>
                <h1 className='font-bold my-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />

                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers?.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id)
                            return (
                                <div
                                    onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                    className='flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer'
                                    key={suggestedUser?._id}
                                >
                                    <Avatar src={suggestedUser?.profilePicture} />
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser?.username}</span>
                                        <span
                                            className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {isOnline ? "online" : "offline"}

                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </section>

            {
                selectedUser ? (
                    <section className='flex-1 border-l border-gray-300 flex flex-col h-full py-2 my-2 '>
                        <div className='flex gap-3 items-center px-3 py-2  sticky top-0 bg-white z-10'>
                            <Avatar src={selectedUser?.profilePicture} />
                            <div className='flex flex-col'>
                                <span className='font-semibold text-lg'>{selectedUser?.username}</span>
                            </div>
                        </div>

                        <Messages selectedUser={selectedUser} />

                        <div className='flex items-center p-4 border-t border-gray-300'>
                            <input
                                value={textMessage}
                                onChange={(e) => {
                                    setTextMessage(e.target.value);
                                }}
                                type="text"
                                className=' w-full h-[30px] p-2 outline-none border-none focus:ring-1 focus:ring-sky-200'
                                placeholder='Messages...'
                            />
                            <IoSend
                                size={'30px'}
                                onClick={() => sendMessageHandler(selectedUser?._id)}
                            />
                        </div>

                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <LuMessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium text-xl'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage;
