import React, { useRef, useState } from 'react';
import { Avatar, Button, TextField } from '@mui/material';
import { API_ENDPOINT, readFileAsDataUrl } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setPosts } from '../redux/postSlice';
import { setUserProfile } from '../redux/authSlice';

export const inputStyle = {
  '& .MuiOutlinedInput-root': {
    width: '100%',
    minHeight: '100px',
    overflowY: 'auto',
    borderRadius: '8px',
    boxSizing: 'border-box',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      // border: '2px solid #1976d2',
    },
  },
  '& .MuiInputBase-input': {
    padding: '5px',
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#1976d2',
    },
  },
};

const CreatePost = ({ setOpenCreatePost }) => {

  const imageRef = useRef();
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const { user, userProfile } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);

  const dispatch = useDispatch();
  

  

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImagePreview(dataUrl);
    }
  }

  const clearFormData = () => {
    setFile('');
    setImagePreview('');
    setCaption('');
  }

  const createPostHandler = async () => {

    setLoading(true);

    const formData = new FormData();
    formData.append('caption', caption);
    if (imagePreview) {
      formData.append('image', file);
    }
    
    try {
      
      const res = await axios.post(`${API_ENDPOINT}/api/v1/post/addnewpost`, formData, {
        headers: {
          'Content-Type' : 'multipart/form-data'
        },
        withCredentials : true
      });


      
      if (res?.data?.success) {
        dispatch(setPosts([res?.data?.post,...posts]));
        setOpenCreatePost(false);
        const updatedPostsArray = [...userProfile.posts, res?.data?.post];
        const updated = { ...userProfile, posts:updatedPostsArray };
        dispatch(setUserProfile(updated))
        

        // console.log('updated',updated);
        toast.success(res?.data?.message);
        clearFormData();


        
      }

    } catch (error) {
      toast(error?.response?.data?.message);
      console.log(error);
      
    } finally {
      setLoading(false);
    }
    
  }

  return (
    <div className="h-[500px] w-[400px] p-4 pt-1 bg-white shadow-lg rounded-lg mx-auto">
      {/* Header */}
      <h1 className="text-center text-xl font-semibold mb-1">Create New Post</h1>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={user?.profilePicture}
          alt="User Avatar"
          sx={{ width: 35, height: 35 }}
        />
        <h1 className="text-gray-700 text-sm font-medium">{ user?.name }</h1>
      </div>

      {/* Image Upload Section */}
      <div className="flex flex-col items-center justify-center gap-4 h-[200px] w-full border-2 border-dashed border-gray-300 rounded-lg mb-4">
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={fileChangeHandler}
        />
        {
          imagePreview && (
            <div className='w-full mt-10 h-64 flex items-center justify-center'>
              <img className='h-full w-full object-cover' src={imagePreview} alt="preview image" />
            </div>
          )
        }

        {
          !imagePreview && (
            <div>
              <Button
                onClick={() => imageRef.current.click()}
                variant="contained"
                sx={{ backgroundColor: '#1976d2', textTransform: 'none' }}
              >
                Select from Computer
              </Button>
              <p className="text-gray-500 text-sm">Choose an image to upload</p>
            </div>
          )
        }

      </div>


      <TextField
        id="outlined-textarea"
        placeholder="Share your thoughts about this post..."
        value={caption}
        onChange={(e)=>setCaption(e.target.value)}
        multiline
        fullWidth
        sx={inputStyle}
      />

      {
        imagePreview && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={createPostHandler}
              variant="contained"
              sx={{
                width : '100px',
                backgroundColor: '#1976d2',
                textTransform: 'none',
                marginBottom: '20px'

              }}
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default CreatePost;
