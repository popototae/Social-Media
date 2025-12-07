const router = require('express').Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User")
const Post = require("../models/Post")


router.get('/', verifyToken, async (req, res) => {
    try {
        const userProfile = await User.findOne({ username: req.user.username });
        const userPosts = await Post.find({ username: req.user.username });
        res.status(200).json({
            username: userProfile.username,
            email: userProfile.email,
            bio: userProfile.bio,
            profilePic: userProfile.profilePic,
            friends: userProfile.friends,
            createdAt: userProfile.createdAt,
            posts: userPosts
        })
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;