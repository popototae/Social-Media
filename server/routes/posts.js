const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");
const Post = require("../models/Post");
const User = require("../models/User")

router.post("/", verifyToken, upload.single("file"), async (req, res) => {
    const imageUrl = req.file ? req.file.path : "";
    const newPost = new Post({
        userId: req.user.id,
        username: req.user.username,
        desc: req.body.desc,
        img: imageUrl,
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

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
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

router.delete("/:id", verifyToken, async (req, res) => {
    const cloudinary = require("cloudinary").v2;
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json("Post not found");
        }
        if (post.username === req.user.username) {
            if (post.img) {
                try {
                    const imgUrl = post.img;
                    const urlParts = imgUrl.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const folderName = urlParts[urlParts.length - 2];
                    const fileNameWithoutExt = fileName.split('.')[0];
                    const publicId = `${folderName}/${fileNameWithoutExt}`;
                    await cloudinary.uploader.destroy(publicId);

                } catch (err) {
                    console.log("Error deleting image from Cloudinary:", err);
                }
            }
            await post.deleteOne();
            res.status(200).json("The post has been deleted");

        } else {
            res.status(403).json("You can delete only your post");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;