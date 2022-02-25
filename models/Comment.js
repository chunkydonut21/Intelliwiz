const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const CommentSchema = new mongoose.Schema({
  _answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  },
  reply: {
    type: String,
    required: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

CommentSchema.plugin(timestamps)

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
