const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const QuestionSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

QuestionSchema.plugin(timestamps)

const Question = mongoose.model('Question', QuestionSchema)

module.exports = Question
