import React from 'react'
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSideBar from './RightSideBar';
import useGetAllPosts from '../hooks/useGetAllPosts';
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers';


const Home = () => {

    useGetAllPosts();
    useGetSuggestedUsers();
    
    return (
        <div className='flex '>
            <div className='flex-grow'>
                <Feed />
                <Outlet/>
            </div>
            <RightSideBar/>
        </div>
    )
}

export default Home;
