import React, { useEffect } from 'react'
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import Comment from './Comment';
import { API_ENDPOINT } from '../../utils/constants';
import axios from 'axios';
import { setPosts } from '../redux/postSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const CommentDialog = ({ post, setComments }) => {

  const dispatch = useDispatch();
  const [threeDotsOpen, setThreeDotsOpen] = useState(false);
  const { selectedPost } = useSelector(store => store.post);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState(selectedPost?.comments);
  const [text, setText] = useState('');


  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments);
    }
  }, []);


  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText);
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  }

  const handleThreeDotsOpen = () => {
    setThreeDotsOpen(true);
  }
  const handleThreeDotsClose = () => {
    setThreeDotsOpen(false);
  };

  const commentHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_ENDPOINT}/api/v1/post/addcomment/${selectedPost?._id}`, { text: text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res?.data?.success) {

        const updatedCommentData = [...comment, res?.data?.comment];
        setComment(updatedCommentData);
        setComments(updatedCommentData);

        const updatedPostData = await posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        )

        dispatch(setPosts(updatedPostData));

        toast.success(res?.data?.message);
        setText('');
      };

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex border rounded-lg w-[100%] ">


      <div className="w-[50%] h-full">
        <img
          src={selectedPost?.image}
          alt="post-img"
          className="w-full h-full rounded-t-lg sm:rounded-l-lg sm:rounded-t-none object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="w-[50%] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <Link>
              <Avatar sx={{ height: '30px', width: '30px' }} src={selectedPost?.author?.profilePicture} />
            </Link>
            <Link className="font-semibold">{selectedPost?.author?.username}</Link>
          </div>
          <MoreHorizRoundedIcon sx={{ cursor: 'pointer' }} onClick={handleThreeDotsOpen} />
        </div>

        {/* Caption */}
        <div className="px-3 py-2">
          <p className="text-md">
            <Link className="font-semibold">{selectedPost?.author?.username}</Link> {selectedPost?.caption}
          </p>
        </div>

        {/* Comments Section */}
        <div className="px-3 overflow-y-auto max-h-96">
          {comment?.map((comment) => (
            <Comment key={comment?._id} comment={comment} />
          ))}
        </div>

        {/* Add Comment */}
        <div className="flex px-3 my-3 mt-auto border-t border-gray-300">
          <input
            className="h-[30px] outline-none w-full text-sm placeholder:pl-1"
            type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a comment..."
          />
          {text && (
            <button
              disabled={!text.trim()}
              onClick={commentHandler}
              className="text-[#3BADF8]"
            >
              Post
            </button>
          )}
        </div>
      </div>
      <Dialog onClose={handleThreeDotsClose} open={threeDotsOpen}>
        <div className=' flex flex-col gap-1 items-center w-[300px] rounded-lg py-[10px]'>
          <button className='py-[5px] w-full text-[#ED4956] font-bold hover:bg-gray-100'>Unfollow</button>
          <button className='py-[5px] w-full hover:bg-gray-100'>Add to favourites</button>
          {
            (user?._id === post?.author?._id) && (
              <button className=' py-[5px] w-full hover:bg-gray-100'>Delete</button>
            )
          }
        </div>
      </Dialog>
    </div>

  )
}

export default CommentDialog;
