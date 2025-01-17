import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, TextField } from '@mui/material';
import { inputStyle } from './CreatePost';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { API_ENDPOINT } from '../../utils/constants';
import { toast } from 'react-toastify';
import { setAuthuser } from '../redux/authSlice';

const EditProfile = () => {

    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const imageRef = useRef();

    
    const [input, setInput] = useState({

        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender,
        name: user?.name,
        username: user?.username,

    });


    

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {

        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file })
        
    };

    const selectChangeHandler = (e) => {

        setInput({ ...input, gender: e.target.value });

    }

    const editProfileHandler = async() => {
        setLoading(true);

        const formData = new FormData();
        formData.append('bio', input?.bio);
        formData.append('gender', input?.gender);
        formData.append('name', input?.name);
        formData.append('username', input?.username);
        if (input.profilePhoto) {
            formData.append('profilePicture', input.profilePhoto);
        }


        try {
            const res = await axios.post(`${API_ENDPOINT}/api/v1/user/profile/edit`, formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                const updatedUserData = {
                    ...user,
                    bio: res?.data?.user?.bio,
                    profilePicture: res?.data?.user?.profilePicture,
                    gender: res?.data?.user?.gender,
                    name: res?.data?.user?.name,
                    username: res?.data?.user?.username
                };
                dispatch(setAuthuser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res?.data?.message);
            };
            

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex max-w-2xl mx-auto pl-10 my-4'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>

                <div className='flex items-center justify-between gap-3 h-[70px] bg-gray-100 rounded-xl px-4' >
                    <div className='flex items-center gap-3'>
                        <div>
                            <Avatar src={user?.profilePicture} />
                        </div>


                        <div className='pb-2'>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <h1 className='text-sm text-gray-600 '>{user?.name}</h1>
                        </div>
                    </div>

                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />

                    <Button
                        variant='contained'
                        onClick={() => imageRef.current.click()}
                    >
                        Change photo
                    </Button>

                </div>

                <div>
                    <h1 className='font-bold text-xl'>Bio</h1>
                    <TextField
                        value={input.bio}
                        onChange={(e) => {
                            setInput({...input , bio : e.target.value})
                        }}
                        id="outlined-textarea"
                        placeholder="Share your thoughts about this post..."
                        multiline
                        fullWidth
                        sx={inputStyle}
                    />
                </div>

                <div>
                    <h1 className='font-bold'>Gender</h1>
                    <Select
                        sx={{ width: '100%', marginTop: '10px' }}
                        value={input?.value}
                        defaultValue={input?.gender}
                        onChange={selectChangeHandler}

                    >
                        <MenuItem sx={{ width: '50%' }} value='male'>Male</MenuItem>
                        <MenuItem sx={{ width: '50%' }} value='female'>Female</MenuItem>
                        <MenuItem sx={{ width: '50%' }} value='other'>Other</MenuItem>
                    </Select>
                </div>

                <div>
                    <h1 className='font-bold'>Name</h1>
                    <TextField
                        sx={{ width: '100%', marginTop: '10px' }}
                        value={input.name}
                        onChange={(e) => {
                            setInput({ ...input, name: e.target.value });
                        }}
                    />
                </div>
                <div>
                    <h1 className='font-bold'>Username</h1>
                    <TextField
                        sx={{ width: '100%', marginTop: '10px' }}
                        value={input.username}
                        onChange={(e) => {
                            setInput({ ...input, username: e.target.value });
                        }}
                    />
                </div>

                <div>
                    {
                        loading ? (
                            <Button variant='contained' sx={{ display: 'flex', marginLeft: 'auto', width: '200px' }}>
                                Submitting
                            </Button>
                        ) : (
                            <Button onClick={editProfileHandler} variant='contained' sx={{ display: 'flex', marginLeft: 'auto', width: '200px' }}>
                                Submit
                            </Button>
                        )
                    }
                </div>

            </section>
        </div>
    )
}

export default EditProfile;
