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
      type: notification.type,
      title: notification.title,
      iconUrl: notification.profileImageKey
        ? await storageService.getFileUrl(notification.profileImageKey)
        : notification.iconKey
        ? await storageService.getFileUrl(notification.iconKey)
        : null,
      ...(notification.storyImageKey && {
        storyImageUrl: notification.storyImageKey
          ? await storageService.getFileUrl(notification.storyImageKey)
          : null,
      }),
      ...(notification.isFollowedBack && {
        isFollowedBack: notification.isFollowedBack,
      }),
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

exports.deleteNotification = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { notificationId } = req.body

  if (notificationId) {
    await notificationService.checkNotificationExistById(accountId, notificationId)
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
