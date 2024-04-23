const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')
const storageService = require('./storage')

exports.getAccountById = (accountId, data = { _id: 1 }) => {
  const query = {
    _id: getObjectId(accountId),
  }

  return DbRepo.findOne(collections.ACCOUNT, { query, data })
}

exports.getAccount = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.ACCOUNT, { query, data })
}

exports.getAccounts = (query = {}, data = { _id: 1 }) => {
  return DbRepo.find(collections.ACCOUNT, { query, data })
}

exports.checkAccountExistById = async (accountId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(accountId),
    }

    const account = await DbRepo.findOne(collections.ACCOUNT, { query, data })

    if (!account) {
      throw new ApiError(
        messages.ERROR.ACCOUNT_NOT_FOUND,
        httpStatus.UNAUTHORIZED
      )
    }

    return account
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.createAccount = (body) => {
  const data = {
    ...body,
  }

  return DbRepo.create(collections.ACCOUNT, { data })
}

exports.updateAccountById = (accountId, updateData = {}) => {
  const query = {
    _id: getObjectId(accountId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}

exports.updateAccount = (query = {}, updateData = {}) => {
  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}

exports.removeAccountFieldsById = (accountId, fields = {}) => {
  const query = {
    _id: getObjectId(accountId),
  }

  const data = {
    $unset: {
      ...fields,
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}

exports.validateFollowedAccounts = async (accountId, accounts) => {
  try {
    const { followingAccounts } = await exports.getAccountById(accountId, {
      followingAccounts: 1,
    })

    for (let account of accounts) {
      if (followingAccounts.includes(account._id)) {
        account.isFollowed = true
      } else {
        account.isFollowed = false
      }
    }

    return accounts
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.addPublishersFileUrls = async (accounts) => {
  try {
    const updatedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const profileImageUrl = account.profileImageKey
          ? await storageService.getFileUrl(account.profileImageKey)
          : null

        return {
          id: account._id,
          fullName: account.fullName,
          profileImageUrl,
          isFollowed: account.isFollowed,
        }
      })
    )

    return updatedAccounts
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.addAccountsFileUrls = async (accounts) => {
  try {
    const updatedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const profileImageUrl = account.profileImageKey
          ? await storageService.getFileUrl(account.profileImageKey)
          : null

        account.profileImageUrl = profileImageUrl
        delete account.profileImageKey

        return { ...account }
      })
    )

    return updatedAccounts
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.toggleFollow = (followerAccountId, followingAccountId, isFollowed) => {
  const query = isFollowed
    ? {
        _id: getObjectId(followerAccountId),
        followingAccounts: { $ne: getObjectId(followingAccountId) },
      }
    : {
        _id: getObjectId(followerAccountId),
        followingAccounts: { $eq: getObjectId(followingAccountId) },
      }

  const data = {
    [isFollowed ? '$push' : '$pull']: {
      followingAccounts: getObjectId(followingAccountId),
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}

exports.getAccountsWithFilter = (filter) => {
  const search = filter.search || ''
  const sortBy = filter.sortBy || 'newest_first'
  const page = filter.page || 1
  const limit = filter.limit || 10

  const pipeline = []

  pipeline.push({
    $match: {
      role: { $ne: 'admin' },
    },
  })

  pipeline.push({
    $match: {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { website: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { language: { $regex: search, $options: 'i' } },
      ],
    },
  })

  if (filter.userType) {
    pipeline.push({
      $match: {
        type: filter.userType,
      },
    })
  }

  switch (sortBy) {
    case 'userName_asc':
      pipeline.push({ $sort: { userName: 1 } })
      break

    case 'userName_desc':
      pipeline.push({ $sort: { userName: -1 } })
      break

    case 'email_asc':
      pipeline.push({ $sort: { email: 1 } })
      break

    case 'email_desc':
      pipeline.push({ $sort: { email: -1 } })
      break

    case 'newest_first':
      pipeline.push({ $sort: { createdAt: -1 } })
      break

    case 'oldest_first':
      pipeline.push({ $sort: { createdAt: 1 } })
      break

    default:
      pipeline.push({ $sort: { createdAt: -1 } })
  }

  pipeline.push(
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        profileImageKey: 1,
        email: 1,
        mobile: 1,
        dateOfBirth: 1,
        gender: 1,
        country: 1,
        website: 1,
        language: 1,
        isVerified: 1,
        type: 1,
        _id: 0,
        id: '$_id',
      },
    }
  )

  return DbRepo.aggregate(collections.ACCOUNT, pipeline)
}
