const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const FollowSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

FollowSchema.plugin(timestamps)

const Follow = mongoose.model('Follow', FollowSchema)

module.exports = Follow
