const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema({
    sender: { 
        type: String, 
        ref: 'User' 
    },
    receiver: { 
        type: String, 
        ref: 'User' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'rejected'], 
        default: 'pending' 
    }

}, { timestamps: true });

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);