import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from '../config/datauri.js';
import cloudinary from '../config/cloudinary.js';
import Post from '../models/post.model.js'


export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res
                .status(200)
                .json({
                    message: "Please fill all the fields",
                    success: false
                });
        };

        // check if email already in use
        const user2 = await User.findOne({ email });
        if (user2) {
            return res
                .status(401)
                .json({
                    message: "Email already used.",
                    success: false
                });
        };

        // check if username already in use
        const user1 = await User.findOne({ username });
        if (user1) {
            return res
                .status(401)
                .json({
                    message: "Try different username.",
                    success: false
                });
        };




        // convert into hashed password
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        return res
            .status(201)
            .json({
                message: "Account created successfully.",
                success: true
            });

    } catch (error) {
        console.log(error);

    };
};


export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(200)
                .json({
                    message: "Please fill all the fields",
                    success: false
                });
        };

        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({
                    message: 'User not found.',
                    success: false
                });
        };

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({
                    message: 'Incorrect password',
                    success: false
                });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // poppulate each post id in the posts array
        const populatedPost = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId)
                if (post.author.equals(user._id)) {
                    return post;
                }

                return null
            })
        )
        user = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPost,
            bookmarks: user.bookmarks
        }


        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.name}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);

    }
};

export const logout = async (req, res) => {
    try {
        return res
            .cookie('token', '', { maxAge: 0 })
            .json({
                message: "Logged out successfully",
                success: true
            });
    } catch (error) {

    }
};

export const getProfile = async (req, res) => {
    try {

        const userId = req.params.id;
        const user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate({ path: 'bookmarks', createdAt: -1 });

        return res
            .status(200)
            .json({
                user,
                success: true
            });

    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender, name, username } = req.body;
        const profilePicture = req.file;
        let cloudResponse;


        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }


        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    message: "This username is already taken. Please try a different username.",
                    success: false
                });
            }
        }


        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (name) user.name = name;
        if (username) user.username = username;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;


        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false,
            error: error.message
        });
    }
};


export const getSuggestedUsers = async (req, res) => {
    try {

        const userId = req.id;
        const suggestedUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        if (!suggestedUsers) {
            return res
                .status(400)
                .json({
                    message: "Currently do not have any users."
                });
        };

        return res
            .status(200)
            .json({
                message: "These are the users.",
                success: true,
                suggestedUsers
            });


    } catch (error) {
        console.log(error);

    };
};

export const followOrUnfollow = async (req, res) => {
    try {
        const folllowKarneWala = req.id;
        const jiskoFollowKarunga = req.params.id;

        if (folllowKarneWala === jiskoFollowKarunga) {
            return res
                .status(400)
                .json({
                    message: 'You cannot follow or unfollow yourself.',
                    success: false
                });
        };

        const user = await User.findById(folllowKarneWala);
        const targetUser = await User.findById(jiskoFollowKarunga);

        if (!user || !targetUser) {
            return res
                .status(400)
                .json({
                    message: 'User not found.',
                    success: false
                });
        };

        // follow karna hai ya unfollow

        const isFollowing = user.following.includes(jiskoFollowKarunga);

        if (isFollowing) {
            // unfollow logic
            await Promise.all([
                User.updateOne({ _id: folllowKarneWala }, { $pull: { following: jiskoFollowKarunga } }),
                User.updateOne({ _id: jiskoFollowKarunga }, { $pull: { followers: folllowKarneWala } })
            ]);

            return res
                .status(200).
                json({
                    message: `you unfollowed ${targetUser.name}`,
                    success: true
                });

        } else {
            // follow logic
            await Promise.all([
                User.updateOne({ _id: folllowKarneWala }, { $push: { following: jiskoFollowKarunga } }),
                User.updateOne({ _id: jiskoFollowKarunga }, { $push: { followers: folllowKarneWala } })
            ]);

            return res
                .status(200).
                json({
                    message: `you followed ${targetUser.name}`,
                    success: true
                });
        };

    } catch (error) {
        console.log(error);

    };
};