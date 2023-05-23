const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    content:{type:String},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    likes: [{sender_id: {type: mongoose.Schema.Types.ObjectId, ref: "user"}}],
    comments: [{
        post_id: {type: mongoose.Schema.Types.ObjectId, ref: "post"},
        sender_id: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
        comment_id: {type: mongoose.Schema.Types.ObjectId, ref: "comment"}
    }
    ],
    likesCount: {type: Number, default:0}
}, {timestamps: true})

const post = mongoose.model("post", postSchema)
module.exports = post
