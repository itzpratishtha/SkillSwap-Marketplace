import Notification from "../models/Notification.js";

export const createNotification = async ({
    user,
    sender,
    learningRequest,
    title,
    message,
    type
}) => {

    return await Notification.create({
        user,
        sender,
        learningRequest,
        title,
        message,
        type
    });
};

export const getNotifications = async (userId) => {

    return await Notification.find({

        user:userId

    })
    .sort({
        createdAt:-1
    });

};

export const markNotificationRead = async (
    notificationId,
    userId
) => {

    return await Notification.findOneAndUpdate(

        {
            _id:notificationId,
            user:userId
        },

        {
            isRead:true
        },

        {
            new:true
        }

    );

};

export const markAllNotificationsRead = async (
    userId
) => {

    return await Notification.updateMany(

        {
            user:userId,
            isRead:false
        },

        {
            isRead:true
        }

    );

};

export const getUnreadNotificationCount = async (userId) => {

    return await Notification.countDocuments({

        user: userId,

        isRead: false

    });

};