import { useEffect, useState } from "react";

import notificationAPI from "../../api/notification.api";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {

    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);


    async function loadUnreadCount() {

        try {

            const response =
                await notificationAPI.getUnreadCount();

            setUnreadCount(
                response.count || 0
            );

        } catch (error) {

            console.error(
                "Failed to load notification count:",
                error
            );

        }
    }


    useEffect(() => {

        loadUnreadCount();

        /*
         * Refresh count periodically.
         *
         * Later we'll replace this with Socket.io
         * for instant notification updates.
         */

        const interval =
            setInterval(
                loadUnreadCount,
                30000
            );

        return () =>
            clearInterval(interval);

    }, []);


    return (

        <div className="relative">

            <button
                onClick={() =>
                    setOpen((previous) => !previous)
                }
                className="relative w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-xl"
                aria-label="Notifications"
            >

                🔔

                {unreadCount > 0 && (

                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">

                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}

                    </span>

                )}

            </button>


            <NotificationDropdown
                open={open}
                onClose={() => setOpen(false)}
                onCountChange={loadUnreadCount}
            />

        </div>
    );
}