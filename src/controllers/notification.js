const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { storageService, notificationService } = require('../services')

exports.getNotifications = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  let notifications = await notificationService.getAllNotification(accountId)

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
      isFollow: notification.isFollow,
      isRead: notification.isRead,
    }))
  )

  await notificationService.setNotificationsAsRead(accountId)

  return sendResponse(
    res,
    httpStatus.OK,
    { notifications },
    messages.SUCCESS.NOTIFICATION_FETCHED
  )
})

exports.deleteNotification = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { notificationId } = req.params

  await notificationService.deleteNotification(accountId, notificationId)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.NOTIFICATION_DELETED
  )
})

exports.deleteAllNotifications = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  await notificationService.deleteAllNotifications(accountId)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.NOTIFICATION_DELETED
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
