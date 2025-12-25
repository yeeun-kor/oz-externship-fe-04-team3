export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const API_PATHS = {
  USER: {
    GET: '/api/v1/accounts/me',
    LOGIN: '/api/v1/accounts/login',
    REFRESH_TOKEN: '/api/v1/accounts/token/refresh',
  },
  LOGOUT: {
    POST: '/api/v1/accounts/logout',
  },
  CHAT: {
    ROOMS: '/api/v1/chatrooms',
    ROOM: (groupId: number | string) => `/api/v1/chatrooms/${groupId}`,
    MESSAGES: (group_id: number | string) =>
      `/api/v1/chatrooms/${group_id}/messages`,
    CREATE_MESSAGE: (groupId: number | string) =>
      `/api/v1/chatrooms/${groupId}/messages/create`,
    MEMBER_READ: (group_id: number | string, member_id: number | string) =>
      `/api/v1/chatrooms/${group_id}/members/${member_id}/read`,
    ROOM_READ: (groupId: number | string) =>
      `/api/v1/chatrooms/${groupId}/read`,
    MESSAGE_DETAIL: (messageId: number | string) =>
      `/api/v1/messages/${messageId}`,
  },
  REVIEW: {
    MSW_LIST: '/api/v1/study-groups/:groupId/reviews',
    MSW_DETAIL: '/api/v1/study-groups/:groupId/reviews/:reviewId',
    LIST: (groupId: number | string) =>
      `/api/v1/study-groups/${groupId}/reviews`,
    DETAIL: (groupId: number | string, reviewId: number | string) =>
      `/api/v1/study-groups/${groupId}/reviews/${reviewId}`,
  },
  STUDYGROUP: {
    LIST: `/api/v1/study-groups`,
    CREATE: `/api/v1/study-groups`,
    LECTURES: `/api/v1/lectures`,
    DETAIL: (groupId: number | string) => `/api/v1/study-groups/${groupId}`,
    DELEGATE_LEADER: (groupId: number | string) =>
      `/api/v1/study-groups/${groupId}/delegate-leader`,
    LEAVE: (groupId: number | string) =>
      `/api/v1/study-groups/${groupId}/members/me`,
    KICK_MEMBER: (groupId: number | string, memberId: number | string) =>
      `/api/v1/study-groups/${groupId}/members/${memberId}`,
  },
  SCHEDULE: {
    LIST: (group_id: number | string) =>
      `/api/v1/study-groups/${group_id}/schedules`,
    DETAIL: (group_id: number | string, schedule_id: number | string) =>
      `/api/v1/study-groups/${group_id}/schedules/${schedule_id}`,
  },
  STUDYNOTE: {
    LIST: (groupId: number | string) => `/api/v1/study-groups/${groupId}/notes`,
    DETAIL: (groupId: number | string, noteId: number | string) =>
      `/api/v1/study-groups/${groupId}/notes/${noteId}`,
  },
  S3: {
    PRESIGNED_URL: '/api/v1/s3-presigned-url',
    DELETE_FILE: '/api/v1/s3-file',
  },
} as const
