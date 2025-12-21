const router = require("express").Router();
const Comment = require("../models/Comment");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, async (req, res) => {
    const newComment = new Comment({
        ...req.body,
        userId: req.user.username
    });

    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/:postId", verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/count/:postId", verifyToken, async (req, res) => {
    try {
        const count = await Comment.countDocuments({ postId: req.params.postId });
        res.status(200).json(count);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;