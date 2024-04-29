const messages = {
  ERROR: {
    ACCOUNT_EXISTS_WITH_EMAIL: 'Account already exists with this email',
    ACCOUNT_EXISTS_WITH_USERNAME: 'Account already exists with this User name',
    ACCOUNT_EXISTS_WITH_MOBILE:
      'Account already exists with this mobile number',
    ACCOUNT_NOT_EXIST_WITH_EMAIL: 'Account does not exist with this email',
    INCORRECT_PASSWORD: 'Incorrect password',
    ACCOUNT_NOT_FOUND: 'Account not found',
    ERROR_SENDING_MAIL: 'Error sending mail',
    INVALID_REGISTER_OTP: 'Invalid registeration OTP',
    EMAIL_NOT_VERIFIED: 'Email is not verified',
    INVALID_RESET_PASSWORD_OTP: 'Invalid reset password OTP',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again',
    INVALID_TOKEN: 'Invalid token or signature',
    TOKEN_EXPIRED: 'Token expired',
    SESSION_NOT_FOUND: 'Session not found',
    LIMIT_FILE_COUNT: 'One file is allowed to be uploaded',
    LIMIT_UNEXPECTED_FILE: 'Incorrect upload field name',
    LIMIT_PART_COUNT: 'Upload rejected: upload form has too many parts',
    LIMIT_FIELD_KEY:
      'Upload rejected: upload field name for the files is too long',
    LIMIT_FIELD_VALUE: 'Upload rejected: upload field is too long',
    LIMIT_FIELD_COUNT: 'Upload rejected: too many fields',
    FILE_NOT_PROVIDED: 'Upload file is not provided',
    FILE_TYPE_NOT_SUPPORTED: 'File type not supported',
    NOT_ALLOWED: 'Not allowed to do this action',
    CANNOT_FOLLOW_YOURSELF: 'You cannot follow yourself',
    TOPIC_NOT_FOUND: 'Topic not found',
    ROUTE_NOT_FOUND: 'Route not found',
    TOPIC_EXISTS_WITH_TITLE: 'Topic already exists with this title',
    TAG_NOT_FOUND: 'Tag not found',
    INVALID_JSON: 'Invalid JSON, please provide valid JSON form-data',
    NOT_ALLOWED_TO_POST_STORY: 'Your account is not allowed to post a story',
    CATEGORY_NOT_FOUND: 'Category not found',
    FAQ_CATEGORY_EXISTS_WITH_TITLE:
      'FAQ Category already exists with this category title',
    FAQ_NOT_FOUND: 'FAQ not found',
    STORY_NOT_FOUND: 'Story not found',
    COMMENT_NOT_FOUND: 'Comment not found',
    NOTIFICATION_NOT_FOUND: 'Notification not found',
    BOOKMARK_EXISTS_WITH_TITLE:
      'Bookmark collection already exists with this title',
    BOOKMARK_COLLECTION_NOT_FOUND: 'Bookmark collection not found',
  },
  SUCCESS: {
    REGISTER_OTP_SENT: 'Registration OTP sent to your email',
    ACCOUNT_REGISTERED: 'Account registered successfully',
    ACCOUNT_LOGGED_IN: 'Account logged in successfully',
    PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent to your email',
    PASSWORD_RESET_OTP_VERIFIED: 'Password reset OTP verified successfully',
    PASSWORD_RESET: 'Password reset successfully',
    ACCOUNT_CREATED: 'Account created successfully',
    ACCOUNT_FETCHED: 'Account fetched successfully',
    ACCOUNT_UPDATED: 'Account updated successfully',
    INTERESTS_FETCHED: 'Interests fetched successfully',
    TOPIC_CREATED: 'Topic created successfully',
    TOPIC_DELETED: 'Topic deleted successfully',
    PUBLISHERS_FETCHED: 'Publishers fetched successfully',
    INTERESTS_SELECTED: 'Interests selected successfully',
    ACCOUNTS_FETCHED: 'Accounts fetched successfully',
    TOPICS_FETCHED: 'Topics fetched successfully',
    TAG_FETCHED: 'TAG fetched successfully',
    SUGGESTED_TAGS_FETCHED: 'Suggested tags fetched successfully',
    STORY_CREATED: 'Story created successfully',
    HOME_DATA_FETCHED: 'Home data fetched successfully',
    FAQ_CATEGORIES_FETCHED: 'FAQ Categories fetched successfully',
    FAQ_CATEGORY_CREATED: 'FAQ Category created successfully',
    FAQ_CATEGORY_UPDATED: 'FAQ Category updated successfully',
    FAQ_CATEGORY_DELETED: 'FAQ Category deleted successfully',
    FAQS_FETCHED: 'FAQs fetched successfully',
    FAQ_CREATED: 'FAQ created successfully',
    FAQ_UPDATED: 'FAQ updated successfully',
    FAQ_DELETED: 'FAQ deleted successfully',
    STORIES_FETCHED: 'Stories fetched successfully',
    STORY_DATA_FETCHED: 'Full Story data fetched successfully',
    COMMENTS_FETCHED: 'Comments fetched successfully',
    COMMENT_REPLIES_FETCHED: 'Comment replies fetched successfully',
    COMMENT_POSTED: 'Comment posted successfully',
    COMMENT_REPLY_POSTED: 'Comment reply posted successfully',
    COMMENT_UPDATED: 'Comment updated successfully',
    COMMENT_DELETED: 'Comment deleted successfully',
    NOTIFICATIONS_FETCHED: 'Notifications fetched successfully',
    NOTIFICATION_DELETED: 'Notification deleted successfully',
    NOTIFICATIONS_DELETED: 'All Notifications deleted successfully',
    NOTIFICATION_UPDATED: 'Notification updated successfully',
    BOOKMARK_COLLECTIONS_FETCHED: 'Bookmark collections fetched successfully',
    BOOKMARK_COLLECTION_CREATED: 'Bookmark collection created successfully',
    BOOKMARK_COLLECTION_DELETED: 'Bookmark collection deleted successfully',
    STORY_SAVED: 'Story saved successfully',
    BOOKMARKED_STORIES_FETCHED: 'Bookmarked stories fetched successfully',
  },
  SUBJECT: {
    REGISTER_ACCOUNT: 'Register your account',
    RESET_PASSWORD: 'Reset your password',
  },
  NOTIFICATION: {
    ACCOUNT_SETUP: 'Your account is ready!',
    STARTED_FOLLOWING: 'started following you',
    PUBLISHED_NEW_STORY: 'published a new story',
  },
}

module.exports = messages
