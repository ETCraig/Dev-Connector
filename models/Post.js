const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            account: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'account'
            }
        }
    ],
    comments: [
        {
            account: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'account'
            },
            text: {
                type: String,
                required: true
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model("post", PostSchema)