import React, { useEffect, useState } from 'react'
import { Button, Input, TextField } from '@mui/material';
import { MuiInputStyles } from '../../muiStyles/muiStyles';
import { API_ENDPOINT } from '../../utils/constants';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthuser } from '../redux/authSlice';
import { setLikeNotification } from '../redux/rtnSlice';


const Login = () => {

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
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
            email: '',
            password: '',
        });
    }

    const signUpHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await axios.post(`${API_ENDPOINT}/api/v1/user/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                dispatch(setAuthuser(res?.data?.user));
                toast.success(res?.data?.message);
                navigate('/');
            }

            await resetInputs();


        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
            setErrorMessage(error?.response?.data?.message);

        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        dispatch(setLikeNotification([]));
        if (user) {
            navigate('/')
        }
    }, [])

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

                    {
                        loading ? (
                            <Button
                                type='submit'
                                variant='contained'
                            >
                                Loading...
                            </Button>
                        ) : (
                            <Button
                                type='submit'
                                variant='contained'
                            >
                                Login
                            </Button>
                        )
                    }



                    <p
                        className='text-sm'>new user?
                        <Link to='/signup' className='text-blue-600 ml-1 hover:underline cursor-pointer'>Create account.</Link>.
                    </p>

                </div>
            </form>
        </div>
    )
}

export default Login;
