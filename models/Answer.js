const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const AnswerSchema = new mongoose.Schema({
  _question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  reply: {
    type: String,
    required: true
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

AnswerSchema.plugin(timestamps)

const Answer = mongoose.model('Answer', AnswerSchema)

module.exports = Answer
