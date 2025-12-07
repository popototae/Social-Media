const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const Post = require("../models/Post");
const User = require("../models/User")

router.post("/", verifyToken, async (req, res) => {
    const newPost = new Post({
        userId: req.user.id,
        username: req.user.username,
        desc: req.body.desc,
    });

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const userPosts = await Post.find({ username: currentUser.username });
        const friendPosts = await Promise.all(
            currentUser.friends.map((friendId) => {
                return Post.find({ username: friendId });
            })
        );
        const allPosts = userPosts.concat(...friendPosts);
        allPosts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        res.json(allPosts);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.put("/:id/like", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user.username)) {
            await post.updateOne({ $push: { likes: req.user.username } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.user.username } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;