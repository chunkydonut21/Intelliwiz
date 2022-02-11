const User = require('../models/User')

const generateUserName = async (userNameSlug) => {
  let index = 0

  const user = await User.findOne({ userName: { $regex: userNameSlug } })

  if (user) {
    userNameSlug = userNameSlug + '-' + index++
    generateUserName(userNameSlug)
  }

  return userNameSlug
}

module.exports = generateUserName
