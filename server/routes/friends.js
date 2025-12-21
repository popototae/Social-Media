const router = require("express").Router();
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const verifyToken = require("../middleware/verifyToken");

router.post("/request/:receiverId", verifyToken, async (req, res) => {
    try {
        const senderId = req.user.username;
        const receiverId = req.params.receiverId;

        if (senderId === receiverId) return res.status(400).json("You cannot add yourself");
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if (existingRequest) return res.status(400).json("คำขอนี้ได้ถูกส่งไปแล้ว หรือคุณเป็นเพื่อนกันแล้ว");

        const newRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId
        });

        await newRequest.save();
        res.status(200).json("Friend Request Sent!");
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
});

router.put("/accept/:requestId", verifyToken, async (req, res) => {
    try {
        const request = await FriendRequest.findById(req.params.requestId);
        if (!request) return res.status(404).json("Request not found");
        await User.findOneAndUpdate(
            { username: request.sender },
            { $push: { friends: request.receiver } }
        );
        await User.findOneAndUpdate(
            { username: request.receiver },
            { $push: { friends: request.sender } }
        );
        await FriendRequest.findByIdAndDelete(req.params.requestId);
        res.status(200).json("Friend request accepted!");
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.delete("/delete/:requestId", verifyToken, async (req, res) => {
    try {
        await FriendRequest.findByIdAndDelete(req.params.requestId);
        res.status(200).json("Friend request deleted!");
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get("/suggestions", verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const users = await User.find({
            $and: [
                { _id: { $ne: req.user.id } },
                { username: { $nin: currentUser.friends } }
            ]
        })
            .select("username email profilePic")
            .limit(20);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/requests/incoming", verifyToken, async (req, res) => {
    try {
        const currentUserUsername = req.user.username;

        const requests = await FriendRequest.aggregate([
            { $match: { receiver: currentUserUsername, status: 'pending' } },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "username",
                    as: "senderInfo",
                },
            },
            { $unwind: "$senderInfo" },
            {
                $project: {
                    _id: 1,
                    sender: "$senderInfo.username",
                    profilePic: "$senderInfo.profilePic",
                    email: "$senderInfo.email",
                    createdAt: 1,
                },
            },
        ]);

        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch incoming requests." });
    }
});

module.exports = router;