const router = require('express').Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User")
const Post = require("../models/Post")
const upload = require("../middleware/upload");
const cloudinary = require("cloudinary").v2;

router.get('/', verifyToken, async (req, res) => {
    try {
        const userProfile = await User.findOne({ username: req.user.username });
        const userPosts = await Post.find({ username: req.user.username });
        const friendProfile = await Promise.all(
            userProfile.friends.map((friendId) => {
                return User.findOne({ username: friendId }).select("username email profilePic");
            })
        );

        res.status(200).json({
            username: userProfile.username,
            email: userProfile.email,
            bio: userProfile.bio,
            profilePic: userProfile.profilePic,
            friends: friendProfile,
            createdAt: userProfile.createdAt,
            posts: userPosts
        })
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.get('/friends', verifyToken, async (req, res) => {
    try {
        const userProfile = await User.findOne({ username: req.user.username });
        const friendProfile = await Promise.all(
            userProfile.friends.map((friendId) => {
                return User.findOne({ username: friendId }).select("username email profilePic");
            })
        );
        res.status(200).json(friendProfile)
    }
    catch (err) {
        console.log(err)
        res.status(501).json(err)
    }
})

router.get('/img/:username', async (req, res) => {
    try {
        const profile = req.params.username;
        const profileImg = await User.findOne({ username: profile }).select("profilePic");
        res.status(200).redirect(profileImg.profilePic)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.get('/:username', verifyToken, async (req, res) => {
    try {
        const usernameToFind = req.params.username;
        const userProfile = await User.findOne({ username: usernameToFind });
        const userPosts = await Post.find({ username: usernameToFind });
        const friendProfile = await Promise.all(
            userProfile.friends.map((friendId) => {
                return User.findOne({ username: friendId }).select("username email profilePic");
            })
        );

        res.status(200).json({
            username: userProfile.username,
            email: userProfile.email,
            bio: userProfile.bio,
            profilePic: userProfile.profilePic,
            friends: friendProfile,
            createdAt: userProfile.createdAt,
            posts: userPosts
        })
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.put("/", verifyToken, upload.single("file"), async (req, res) => {
    try {
        const currentUser = await User.findOne({ username: req.user.username });
        const updateData = {
            email: req.body.email,
            bio: req.body.bio,
        };

        if (req.file) {
            updateData.profilePic = req.file.path;
            if (currentUser.profilePic) {
                try {
                    const imgUrl = currentUser.profilePic;
                    const urlParts = imgUrl.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const folderName = urlParts[urlParts.length - 2];
                    const fileNameWithoutExt = fileName.split('.')[0];
                    const publicId = `${folderName}/${fileNameWithoutExt}`;
                    await cloudinary.uploader.destroy(publicId);

                } catch (err) {
                    console.log("Error deleting old image from Cloudinary:", err);
                }
            }
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: req.user.username },
            { $set: updateData },
            { new: true }
        );

        const { password, ...other } = updatedUser._doc;
        res.status(200).json(other);

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});


module.exports = router;