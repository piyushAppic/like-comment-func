const mongoose = require('mongoose');

// Define the Comment schema
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// Create the Comment model
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
