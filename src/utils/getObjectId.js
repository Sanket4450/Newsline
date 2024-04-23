const mongoose = require('mongoose')

const getObjectId = (id) => mongoose.Types.ObjectId.createFromHexString(id)

module.exports = { getObjectId }
