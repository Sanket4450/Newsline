const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { storageService, notificationService } = require('../services')

exports.getNotifications = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  let notifications = await notificationService.getAllNotifications(accountId)

  notifications = await Promise.all(
    notifications.map(async (notification) => ({
      title: notification.title,
      type: notification.type,
      iconUrl: notification.profileImageKey
        ? await storageService.getFileUrl(notification.profileImageKey)
        : notification.iconKey
        ? await storageService.getFileUrl(notification.iconKey)
        : null,
      storyImageUrl: notification.storyImageKey
        ? await storageService.getFileUrl(notification.storyImageKey)
        : null,
      isFollowedBack: notification.isFollowedBack,
    }))
  )

  await notificationService.updateNotifications(accountId, { isRead: true })

  return sendResponse(
    res,
    httpStatus.OK,
    { notifications },
    messages.SUCCESS.NOTIFICATIONS_FETCHED
  )
})

exports.updateNotification = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { notificationId } = req.params

  await notificationService.updateNotification(accountId, notificationId)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.NOTIFICATION_UPDATED
  )
})

exports.deleteNotification = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { notificationId } = req.body

  if (notificationId) {
    await notificationService.checkNotificationExistById(notificationId)
    await notificationService.deleteNotification(accountId, notificationId)
  } else {
    await notificationService.deleteAllNotifications(accountId)
  }

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    notificationId
      ? messages.SUCCESS.NOTIFICATION_DELETED
      : messages.SUCCESS.NOTIFICATIONS_DELETED
  )
})
