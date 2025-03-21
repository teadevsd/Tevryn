

export const baseURL = 'http://localhost:2323';

export const summaryAPI = {
    register: {
        url: 'api/v1/user/signup',
        method: 'post'
    },
    login: {
        url: 'api/v1/user/login',
        method: 'post'
    },
    logout: {
        url: 'api/v1/user/logout',
        method: 'post'
    },
    getUserProfile: {
        url: 'api/v1/user/user-details',
        method: 'get'
    },
    updateUserProfile: {
        url: 'api/v1/user/update-profile',
        method: 'put'
    },
    uploadAvatar: {
        url: 'api/v1/user/upload-avatar',
        method: 'put'
    },
    checkUsername: {
        url: 'api/v1/user/check-username',
        method: 'post'
    },
    getContacts: {
        url: 'api/v1/friends/get-contacts',
        method: 'get'
    },
    searchUser: {
        url: 'api/v1/friends/search-user',
        method: 'get'
    },
    sendFriendRequest : {
        url: 'api/v1/friends/add-friend',
        method: 'post'
    },
    friendInvite: {
        url: 'api/v1/friends/send-invite',
        method: 'post'
    },
    getMessages: {
        url: 'api/v1/messages/get-messages',
        method: 'get'
    },
    saveMessage: {
        url: 'api/v1/messages/save-message',
        method: 'post'
    },
    getAllContacts: {
        url: 'api/v1/friends/fetch-all-contacts',
        method: 'get'
    },
    uploadFile: {
        url: 'api/v1/file/upload-file',
        method: 'post'
    },
    refreshToken: {
        url: 'api/v1/user/refresh-token',
        method: 'post'
    }
}