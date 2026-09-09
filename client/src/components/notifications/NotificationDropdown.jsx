import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import notificationAPI from "../../api/notification.api";

export default function NotificationDropdown({
    open,
    onClose,
    onCountChange,
}) {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (open) {
            loadNotifications();
        }

    }, [open]);


    async function loadNotifications() {

        try {

            setLoading(true);

            const response =
                await notificationAPI.getNotifications();

            setNotifications(
                response.notifications || []
            );

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        } finally {

            setLoading(false);

        }
    }


async function handleNotificationClick(notification) {

    try {

        // Mark notification as read
        if (!notification.isRead) {

            await notificationAPI.markAsRead(
                notification._id
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item._id === notification._id
                        ? {
                              ...item,
                              isRead: true,
                          }
                        : item
                )
            );

            onCountChange?.();
        }


        // Message notification → open conversation
        if (
            notification.type === "MESSAGE" &&
            notification.learningRequest
        ) {

            const requestId =
                typeof notification.learningRequest === "object"
                    ? notification.learningRequest._id
                    : notification.learningRequest;

            onClose();

            navigate(
                `/messages/${requestId}`
            );

            return;
        }

    } catch (error) {

        console.error(
            "Unable to handle notification:",
            error
        );

    }

        /*
         * We currently don't have a navigation
         * target stored in the Notification model.
         *
         * So for now, clicking only marks it read.
         *
         * Later we can add actionUrl/entityId.
         */
    }


    async function handleMarkAllRead() {

        try {

            await notificationAPI.markAllAsRead();

            setNotifications((previous) =>
                previous.map((item) => ({
                    ...item,
                    isRead: true,
                }))
            );

            onCountChange?.();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to mark notifications as read."
            );

        }
    }


    if (!open) {
        return null;
    }


    return (
<div className="
    fixed
    top-16
    left-2
    right-2
    z-50
    w-auto
    sm:absolute
    sm:top-12
    sm:left-auto
    sm:right-0
    sm:w-[360px]
    bg-white
    rounded-xl
    shadow-xl
    border
    overflow-hidden
">

            {/* HEADER */}

<div className="
    flex
    items-center
    justify-between
    gap-2
    px-3
    sm:px-5
    py-3
    sm:py-4
    border-b
">

                <h2 className="font-bold text-base sm:text-lg">
                    Notifications
                </h2>

                <button
                    onClick={handleMarkAllRead}
                    className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 whitespace-nowrap"
                >
                    Mark all as read
                </button>

            </div>


            {/* CONTENT */}

            <div className="max-h-[420px] overflow-y-auto">

                {loading ? (

                    <div className="p-8 text-center text-slate-500">
                        Loading notifications...
                    </div>

                ) : notifications.length === 0 ? (

                    <div className="p-8 text-center">

                        <div className="text-3xl mb-2">
                            🔔
                        </div>

                        <p className="font-medium text-slate-700">
                            No notifications
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            You're all caught up.
                        </p>

                    </div>

                ) : (

                    notifications.map((notification) => (

                        <button
                            key={notification._id}
                            onClick={() =>
                                handleNotificationClick(
                                    notification
                                )
                            }
                            className={`
    w-full
    text-left
    px-4
    sm:px-5
    py-3
    sm:py-4
    border-b
    hover:bg-slate-50
    transition
    ${
        notification.isRead
            ? "bg-white"
            : "bg-emerald-50"
    }
`}
                            >

                            <div className="flex gap-3 min-w-0">

    {/* UNREAD INDICATOR */}

    <div className="pt-1.5 shrink-0">

        <span
            className={`block w-2.5 h-2.5 rounded-full ${
                notification.isRead
                    ? "bg-transparent"
                    : "bg-emerald-500"
            }`}
        />

    </div>


    {/* NOTIFICATION CONTENT */}

    <div className="flex-1 min-w-0">

        {/* TITLE + TYPE */}

        <div className="flex items-start gap-2">

            <p className="
                flex-1
                min-w-0
                font-semibold
                text-slate-800
                text-sm
                leading-5
                break-words
            ">
                {notification.title}
            </p>


            {notification.type === "MESSAGE" && (
                <span className="
                    shrink-0
                    text-xs
                    bg-blue-100
                    text-blue-700
                    px-2
                    py-0.5
                    rounded-full
                ">
                    Message
                </span>
            )}

        </div>


        {/* DATE */}

        <p className="
            text-xs
            text-slate-400
            mt-1
        ">
            {new Date(
                notification.createdAt
            ).toLocaleDateString()}
        </p>


        {/* MESSAGE */}

        <p className="
            text-sm
            text-slate-600
            mt-1
            leading-5
            break-words
        ">
            {notification.message}
        </p>

    </div>

</div>

                        </button>

                    ))

                )}

            </div>

        </div>
    );
}