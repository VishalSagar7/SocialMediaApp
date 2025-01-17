import sharp from 'sharp'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'
import Comment from '../models/comment.model.js'
import cloudinary from '../config/cloudinary.js'
import { getReceiverSocketId, io } from '../socket/socket.js'

export const addNewPost = async (req, res) => {
    try {

        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res
                .status(400)
                .json({
                    message: "Image required",
                    success: false
                });
        };

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800 })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer()

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        // create new document of post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const userWhoCreatedThePost = await User.findById(authorId);

        if (userWhoCreatedThePost) {
            userWhoCreatedThePost.posts.push(post._id);
            await userWhoCreatedThePost.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res
            .status(200)
            .json({
                message: "Post created successfully.",
                post,
                success: true
            });


    } catch (error) {
        console.log(error);

    };
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post
            .find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'name username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'name profilePicture'
                }
            });

        return res
            .status(200)
            .json({
                posts,
                success: true
            });

    } catch (error) {
        console.log(error);

    }
};


export const getUserPosts = async (req, res) => {
    try {

        const authorId = req.id;

        // getting all posts of the logged in user
        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'name, profilePicture'
            }).populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'name, profilePicture'
                }
            });

        return res
            .status(200)
            .json({
                posts,
                success: true,
            });


    } catch (error) {
        console.log(error);
    };
};

export const LikePost = async (req, res) => {
    try {
        const likeKarneWaleUserKiId = req.id; // ID of the user who is liking the post
        const postId = req.params.id; // ID of the post being liked

        // Fetch the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(likeKarneWaleUserKiId)) {
            return res.status(400).json({ message: 'Post already liked.', success: false });
        }

        // Add the user to the likes array
        post.likes.push(likeKarneWaleUserKiId);
        await post.save();

        // Fetch user details for notification
        const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();

        // Check if the post owner is not the same as the user liking the post
        if (postOwnerId !== likeKarneWaleUserKiId) {
            // Notification object
            const notification = {
                type: 'like',
                userId: likeKarneWaleUserKiId,
                userDetails: user,
                postId,
                postImg: post.image, // Ensure `post.image` exists in your schema
                message: 'Your post was liked',
            };

            // Emit notification event to the post owner's socket
            const postOwnerSocketId = await getReceiverSocketId(postOwnerId);
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification);
            }
        }

        return res.status(200).json({
            message: 'Post liked successfully.',
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong.',
            success: false,
        });
    }
};



export const dislikePost = async (req, res) => {
    try {
        const likeKarneWaleUserKiId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        // like logic

        await Post.updateOne(
            { _id: postId },
            { $pull: { likes: likeKarneWaleUserKiId } }
        );


        // implement socket.io for real time notification

        /// socket.io real time implementation
        const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();

        if (postOwnerId !== likeKarneWaleUserKiId) {
            // emit notification event
            const notification = {
                type: 'dislike',
                userId: likeKarneWaleUserKiId,
                userDetails: user,
                postId,
                message: "Your post was liked",
                postOwnerId: postOwnerId
            }

            // console.log(notification);


            const postOwerSocketId = await getReceiverSocketId(postOwnerId);

            if (postOwerSocketId) {
                io.to(postOwerSocketId).emit('notification', notification);
            }


        }

        return res
            .status(200)
            .json({
                message: 'Post disliked.',
                success: true
            });


    } catch (error) {
        console.log(error);

    };
};


export const addComment = async (req, res) => {
    try {

        const postId = req.params.id;
        const commentKarneWaleUserKiId = req.id;
        const { text } = req.body;

        const post = await Post.findById(postId);

        if (!text) {
            return res
                .status(400)
                .json({
                    message: "text is required",
                    success: false
                });
        };

        const comment = await Comment.create({
            text,
            author: commentKarneWaleUserKiId,
            post: postId
        })

        await comment.populate({
            path: 'author',
            select: 'name username profilePicture'
        })

        post.comments.push(comment._id);
        await post.save();

        return res
            .status(201)
            .json({
                message: "Comment added",
                comment,
                success: true
            });


    } catch (error) {
        console.log(error);

    };
};


export const getCommentsOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId })
            .populate({
                path: 'author',
                select: 'name profilePicture'
            });

        if (!comments) {
            return res
                .status(404)
                .json({
                    message: "No comments found for this post.",
                    success: false
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                comments
            });


    } catch (error) {
        console.log(error);

    };
};


export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res
                .status(404)
                .json({
                    message: 'Post not found.',
                    success: false
                });
        };

        // check if the logged in user is author of the post

        if (post.author.toString() !== authorId) {
            return res
                .status(401)
                .json({
                    message: "Unauthorized user",
                    success: false,
                });
        };

        await Post.findByIdAndDelete(postId);

        // remove the postId from posts field of that author

        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();


        // delete all the comments associated with that post
        await Comment.deleteMany({ post: postId });

        return res
            .status(200)
            .json({
                message: 'Post deleted.',
                success: true
            });

    } catch (error) {
        console.log(error);
    };
};


export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        // Find user and toggle bookmark
        const user = await User.findById(userId);
        const isAlreadyBookmarked = user.bookmarks.includes(postId);

        if (isAlreadyBookmarked) {
            // Remove from bookmarks
            await User.updateOne({ _id: userId }, { $pull: { bookmarks: postId } });

            return res.status(200).json({
                message: "Post unsaved.",
                success: true,
            });
        } else {
            // Add to bookmarks
            await User.updateOne({ _id: userId }, { $push: { bookmarks: postId } });

            return res.status(200).json({
                message: "Post saved.",
                success: true,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating bookmarks.",
            success: false,
            error: error.message,
        });
    }
};
