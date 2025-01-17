import React, { useState } from 'react'
import { Avatar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaRegBookmark } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_ENDPOINT } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { setPosts, setSelectedPost } from '../redux/postSlice';

const Post = ({ post }) => {


    const [threeDotsOpen, setThreeDotsOpen] = useState(false);
    const [openCommentBox, setOpenCommentBox] = useState(false);
    const [commentText, setCommentText] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
    const [postLikeCounter, setPostLikeCounter] = useState(post?.likes.length);
    const [comments, setComments] = useState(post?.comments)
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);



    const handleThreeDotsOpen = () => {
        setThreeDotsOpen(true);
    }
    const handleThreeDotsClose = () => {
        setThreeDotsOpen(false);
    };

    const handleColoseCommentBox = () => {
        setOpenCommentBox(false)
    };

    const handleOpenCommentBox = () => {
        dispatch(setSelectedPost(post));
        setOpenCommentBox(true);
    }

    const handleDeletePost = async (postId) => {
        try {
            const res = await axios.delete(`${API_ENDPOINT}/api/v1/post/deletepost/${postId}`, { withCredentials: true });

            if (res?.data?.success) {
                const updatedPosts = posts.filter((postItem) => postItem?._id !== postId);

                dispatch(setPosts(updatedPosts));
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.log(error);

        } finally {
            setThreeDotsOpen(false);
        }
    };

    const likeOrDislikeHandler = async () => {
        try {

            const action = liked ? 'dislikepost' : 'likepost'
            const res = await axios.get(`${API_ENDPOINT}/api/v1/post/${action}/${post?._id}`, { withCredentials: true });

            if (res?.data?.success) {
                const updatedLikes = liked ? postLikeCounter - 1 : postLikeCounter + 1;
                setPostLikeCounter(updatedLikes);
                // toast.success(res?.data?.message);
                setLiked(!liked);

                // updated your posts here

                const updatedPostData = posts.map(p =>
                    p?._id === post?._id ? {
                        ...p,
                        likes: liked ? p?.likes.filter(id => id !== user?._id) : [...p.likes, user._id]
                    } : p
                )
                dispatch(setPosts(updatedPostData));
            };

        } catch (error) {
            console.log(error);

        }
    };


    const commentHandler = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_ENDPOINT}/api/v1/post/addcomment/${post?._id}`, {text : text} , {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                const updatedCommentData = [...comments, res?.data?.comment];
                setComments(updatedCommentData);

                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? {...p, comments:updatedCommentData} : p
                )

                dispatch(setPosts(updatedPostData));

                toast.success(res?.data?.message);
                setText('');
            };

        } catch (error) {
            console.log(error);
            
        } finally{
            setLoading(false);
        }
    };

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        setText(inputText);
        

        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    };

    const bookMarkHandler = async (postId) => {
        try {
            const res = await axios.get(`${API_ENDPOINT}/api/v1/post/bookmarkpost/${postId}` , {withCredentials : true});

            if (res?.data?.success) {
                console.log(res?.data?.message);
            }


        } catch (error) {
            console.log(error);
            
        }
    }


    

    return (
        <div className='my-8 max-w-md mx-auto '>
            <div className='flex items-center justify-between'>
                <div className='flex items-center w-full '>
                    <div className='flex items-center gap-2'>
                        <Avatar src={post?.author?.profilePicture} alt='post image' />
                        <h1 className='font-semibold'>{post?.author?.username}</h1>
                    </div>
                    <MoreHorizRoundedIcon sx={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={handleThreeDotsOpen} />
                </div>
                <Dialog onClose={handleThreeDotsClose} open={threeDotsOpen}>
                    <div className=' flex flex-col gap-1 items-center w-[300px] rounded-lg py-[10px]'>
                        <button className='py-[5px] w-full text-[#ED4956] font-bold hover:bg-gray-100'>Unfollow</button>
                        <button className='py-[5px] w-full hover:bg-gray-100'>Add to favourites</button>
                        {
                            (user?._id === post?.author?._id) && (
                                <button onClick={() => handleDeletePost(post?._id)} className=' py-[5px] w-full hover:bg-gray-100'>Delete</button>
                            )
                        }
                    </div>
                </Dialog>
            </div>

            <img
                className='rounded-sm aspect-square object-cover my-2 '
                src={post.image}
                alt='post-img'
            />

            <div className='flex justify-between'>
                <div className='flex gap-3'>

                    {liked ? (
                        <FaHeart
                            onClick={() => likeOrDislikeHandler(post?._id)}
                            size={'25px'}
                            className='hover:text-red-600 cursor-pointer text-red-600'
                        />
                    ) : <FaRegHeart
                        onClick={() => likeOrDislikeHandler(post?._id)}
                        size={'25px'}
                        className='hover:text-gray-600 cursor-pointer'
                    />

                    }

                    <FaRegComment
                        onClick={handleOpenCommentBox}
                        size={'25px'}
                        className='hover:text-gray-600 cursor-pointer'
                    />

                    {/* <FiSend
                        size={'25px'}
                        className='hover:text-gray-600 cursor-pointer'
                    /> */}

                </div>
                <FaRegBookmark
                    size={'25px'}
                    className='hover:text-gray-600 cursor-pointer'
                    onClick={()=>bookMarkHandler(post?._id)}
                />
            </div>

            <span className=' font-medium block'>{postLikeCounter} Likes</span>

            <p className=''><span className='font-medium mr-1'>{post?.author?.username}</span> {post?.caption}</p>

            {
                comments.length > 0 && (
                    <span
                        onClick={handleOpenCommentBox}
                        className='text-gray-400 cursor-pointer'>
                        View all {comments.length} comments
                    </span>
                )
            }



            <Dialog
                onClose={handleColoseCommentBox}
                open={openCommentBox}
                fullWidth
                maxWidth="md" // Adjust this to 'lg' or 'xl' for wider dialogs
                scroll="paper" // 
            >
                <CommentDialog
                    post={post}
                    setComments={setComments}
                />
            </Dialog>

            <div className='flex'>
                <input
                    className='h-[30px] outline-none w-full text-sm placeholder:pl-1'
                    type='text'
                    value={text}
                    onChange={changeEventHandler}
                    placeholder='Add a comment...'
                />
                {text && <button onClick={commentHandler} className='text-[#3BADF8]'>{ loading ? "Posting.." : "Post" }</button>}
            </div>

        </div>
    )
}

export default Post;
