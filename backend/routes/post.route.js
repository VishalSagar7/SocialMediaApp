import express from 'express';
import { addNewPost, getAllPost, getUserPosts, LikePost, dislikePost, addComment, getCommentsOnPost, deletePost, bookmarkPost } from '../controllers/post.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';


const router = express.Router();

router.route('/addnewpost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/getallposts').get(isAuthenticated, getAllPost);
router.route('/getuserposts').get(isAuthenticated, getUserPosts);
router.route('/likepost/:id').get(isAuthenticated, LikePost);
router.route('/dislikepost/:id').get(isAuthenticated, dislikePost);
router.route('/addcomment/:id').post(isAuthenticated, addComment);
router.route('/getcommentsonpost/:id').get(isAuthenticated, getCommentsOnPost);
router.route('/deletepost/:id').delete(isAuthenticated, deletePost);
router.route('/bookmarkpost/:id').get(isAuthenticated, bookmarkPost)


export default router;