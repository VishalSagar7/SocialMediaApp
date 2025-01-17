import React, { useState } from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import { API_ENDPOINT } from '../../utils/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAuthuser, setSelectedUser } from '../redux/authSlice';
import { Dialog } from '@mui/material';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '../redux/postSlice';
import Badge from '@mui/material/Badge';
import { setLikeNotification } from '../redux/rtnSlice';
import { setUserProfile } from '../redux/authSlice';
import { setMessages } from '../redux/chatSlice';
import { setOnlineUsers } from '../redux/chatSlice';
import { setSuggestedUsers } from '../redux/authSlice';



const LeftSidebar = () => {

  const navigate = useNavigate();
  const { user, selectedUser } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const { likeNotification } = useSelector(store => store.realTimeNotification);


  const logoutHandler = async () => {
    try {

      const res = await axios.get(`${API_ENDPOINT}/api/v1/user/logout`, { withCredentials: true });

      if (res?.data?.success) {
        dispatch(setAuthuser(null));
        dispatch(setPosts(null));
        dispatch(setSelectedPost(null));
        dispatch(setSelectedUser(null));
        dispatch(setOnlineUsers([]));
        dispatch(setLikeNotification([]));
        dispatch(setUserProfile(null));
        dispatch(setMessages([]));
        dispatch(setSuggestedUsers([]));

        navigate('/login');
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }

  const sideBarHandler = (textType) => {
    console.log(textType);

    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === 'Create') {
      setOpenCreatePost(true);
    } else if (textType === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (textType === 'Home') {
      navigate('/');
    } else if (textType === "Messages") {
      navigate('/chat');
    } else if (textType === "Notifications") {
      navigate('/notifications');
    }
  };

  const handleCloseCreatePost = () => {
    setOpenCreatePost(false);
  }

  const sideBarItems = [
    {
      text: 'Home',
      icon: <HomeRoundedIcon sx={{ fontSize: '33px' }} />
    },
    {
      text: 'Search',
      icon: <SearchRoundedIcon sx={{ fontSize: '33px' }} />
    },
    {
      text: 'Explore',
      icon: <ExploreOutlinedIcon sx={{ fontSize: '33px' }} />
    },
    {
      text: 'Messages',
      icon: <ForumOutlinedIcon sx={{ fontSize: '33px' }} />
    },
    {
      text: 'Notifications',
      icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: '33px' }} />
    },
    {
      text: 'Create',
      icon: <AddCircleOutlineOutlinedIcon sx={{ fontSize: '33px' }} />
    },
    {
      text: 'Profile',
      icon: <Avatar sx={{ fontSize: '33px' }} src={user?.profilePicture} />
    },
    {
      text: 'Logout',
      icon: <ExitToAppRoundedIcon sx={{ fontSize: '33px' }} />
    }

  ];



  return (
    <div className='fixed top-0 left-0 z-10 px-2 lg:px-4 border-r border-gray-300 w-[16%]'>

      <div className='flex flex-col'>

        <h1 className='my-3 lg:pl-3 font-bold text-xl'>LOGO</h1>

        <div>
          {
            sideBarItems.map((item, idx) => {
              return (
                <div
                  onClick={() => sideBarHandler(item.text)}
                  key={idx}
                  className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg lg:p-3 my-3'>

                  <span>{item.icon}</span>
                  <span className='hidden lg:block'>{item.text}</span>

                  {
                    item.text === 'Notifications' && likeNotification.length > 0 && (
                      <>
                        <Badge badgeContent={likeNotification.length} color="primary">

                        </Badge>
                      </>
                    )
                  }

                </div>
              )
            })
          }
        </div>

      </div>

      <Dialog onClose={handleCloseCreatePost} open={openCreatePost}>
        <CreatePost setOpenCreatePost={setOpenCreatePost} />
      </Dialog>

    </div>
  )
}

export default LeftSidebar;
