import React, { useState } from 'react'
import { Button, Input, TextField } from '@mui/material';
import { MuiInputStyles } from '../../muiStyles/muiStyles';
import { API_ENDPOINT } from '../../utils/constants';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Signup = () => {

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });

    const notify = () => toast("Wow so easy!");

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    };

    const resetInputs = () => {
        setInput({
            name: '',
            username: '',
            email: '',
            password: '',
        });
    };

    const signUpHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await axios.post(`${API_ENDPOINT}/api/v1/user/register`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                toast.success(res?.data?.message);
                navigate('/login');
            }

            await resetInputs();


        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
            setErrorMessage(error?.response?.data?.message);
            
        } finally {
            setLoading(false);
        }
        
    };

        useEffect(() => {
            if (user) {
                navigate('/')
            }
        },[])

    return (
        <div className='flex items-center justify-center w-screen h-screen'>

            <form
                onSubmit={signUpHandler}
                className=' shadow-lg flex flex-col gap-3 p-8 lg:w-[350px]'>

                <div className='my-3'>
                    <h1>LOGO</h1>
                    <p className='text-gray-800'>Stay connected with your friends.</p>
                </div>

                <div className='flex flex-col gap-4'>

                    <TextField
                        type='text'
                        label='Name'
                        name='name'
                        sx={MuiInputStyles}
                        value={input.name}
                        onChange={changeEventHandler}
                    />

                    <TextField
                        type='text'
                        label='Username'
                        name='username'
                        sx={MuiInputStyles}
                        value={input.username}
                        onChange={changeEventHandler}
                    />

                    <TextField
                        type='email'
                        label='Email'
                        name='email'
                        sx={MuiInputStyles}
                        value={input.email}
                        onChange={changeEventHandler}
                    />

                    <TextField
                        type='password'
                        label='Password'
                        name='password'
                        sx={MuiInputStyles}
                        value={input.password}
                        onChange={changeEventHandler}
                        autoComplete='password'
                    />

                    {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}.</p>}

                    <Button
                        type='submit'
                        variant='contained'
                    >
                        Signup
                    </Button>

                    <p
                        className='text-sm'>Already have an account
                        <Link to='/login' className='text-blue-600 ml-1 hover:underline cursor-pointer'>login here</Link>.
                    </p>

                </div>
            </form>
        </div>
    )
}

export default Signup;
