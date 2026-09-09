import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import socket from "../../socket";
import messageAPI from "../../api/message.api";
import { useAuth } from "../../contexts/AuthContext";

export default function MessagePage() {

    const { requestId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef(null);

    // =========================================
    // AUTO SCROLL
    // =========================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);


    // =========================================
    // LOAD MESSAGES + SOCKET
    // =========================================

    useEffect(() => {

        if (!requestId) return;

        loadMessages();

        socket.connect();

        socket.emit(
            "join-request",
            requestId
        );

        function handleNewMessage(message) {

            const incomingRequestId =
                typeof message.learningRequest === "object"
                    ? message.learningRequest?._id
                    : message.learningRequest;

            if (
                incomingRequestId?.toString() !==
                requestId.toString()
            ) {
                return;
            }

            setMessages((previous) => {

                const alreadyExists =
                    previous.some(
                        (item) =>
                            item._id === message._id
                    );

                if (alreadyExists) {
                    return previous;
                }

                return [
                    ...previous,
                    message,
                ];
            });
        }

        socket.on(
            "new-message",
            handleNewMessage
        );

        return () => {

            socket.off(
                "new-message",
                handleNewMessage
            );

            socket.disconnect();

        };

    }, [requestId]);


    // =========================================
    // LOAD OLD MESSAGES
    // =========================================

    async function loadMessages() {

        try {

            setLoading(true);

            const response =
                await messageAPI.getMessages(
                    requestId
                );

            console.log(
                "Loaded messages:",
                response.messages
            );

            setMessages(
                response.messages || []
            );

        } catch (error) {

            console.error(
                "Load messages error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load messages."
            );

        } finally {

            setLoading(false);

        }
    }


    // =========================================
    // SEND MESSAGE
    // =========================================

    async function handleSend(e) {

        e.preventDefault();

        const trimmedText =
            text.trim();

        if (!trimmedText) {
            return;
        }

        try {

            setSending(true);

            const response =
                await messageAPI.sendMessage(
                    requestId,
                    {
                        text: trimmedText,
                    }
                );

            console.log(
                "Sent message:",
                response.message
            );

            /*
             * IMPORTANT:
             * Add the API response immediately.
             *
             * Socket.io may also send the same message,
             * but handleNewMessage checks _id and prevents
             * duplicates.
             */

            if (response.message) {

                setMessages((previous) => {

                    const alreadyExists =
                        previous.some(
                            (item) =>
                                item._id ===
                                response.message._id
                        );

                    if (alreadyExists) {
                        return previous;
                    }

                    return [
                        ...previous,
                        response.message,
                    ];
                });
            }

            setText("");

        } catch (error) {

            console.error(
                "Send message error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to send message."
            );

        } finally {

            setSending(false);

        }
    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6">

            <div className="max-w-4xl mx-auto">

                {/* HEADER */}

<div className="flex items-center gap-4 mb-2">

    <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 shrink-0 rounded-full bg-white shadow-sm hover:bg-slate-100 flex items-center justify-center text-xl"
    >
        ←
    </button>

    <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Messages
        </h1>

        <p className="text-xs sm:text-sm text-slate-500">
            Learning Request Conversation
        </p>
    </div>

</div>


{/* CHAT */}

<div className="bg-white rounded-2xl shadow-md overflow-hidden border mt-0">

                    {/* MESSAGE AREA */}

                    <div className="
    h-[60vh]
    min-h-[400px]
    max-h-[550px]
    overflow-y-auto
    p-3
    sm:p-5
    md:p-6
    space-y-4
">

                        {loading ? (

                            <div className="h-full flex items-center justify-center">

                                <p className="text-slate-500">
                                    Loading messages...
                                </p>

                            </div>

                        ) : messages.length === 0 ? (

                            <div className="h-full flex flex-col items-center justify-center text-center">

                                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-2xl mb-4">
                                    💬
                                </div>

                                <h2 className="font-semibold text-slate-700">
                                    Start the conversation
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Discuss your learning goals
                                    and schedule your session.
                                </p>

                            </div>

                        ) : (

                            messages.map((message) => {

                                /*
                                 * sender can be:
                                 *
                                 * {
                                 *    _id,
                                 *    name,
                                 *    profilePhoto
                                 * }
                                 *
                                 * OR just:
                                 *
                                 * "userId"
                                 */

                                const senderId =
                                    typeof message.sender === "object"
                                        ? message.sender?._id
                                        : message.sender;

                                const isMine =
                                    senderId?.toString() ===
                                    user?._id?.toString();

                                const senderName =
                                    typeof message.sender === "object"
                                        ? message.sender?.name
                                        : "User";

                                const senderPhoto =
                                    typeof message.sender === "object"
                                        ? message.sender?.profilePhoto
                                        : "";

                                return (

                                    <div
                                        key={message._id}
                                        className={`flex w-full ${
                                            isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >

                                        {/* OTHER USER */}

                                        {!isMine && (

                                            <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[75%]">

                                                <img
                                                    src={
                                                        senderPhoto ||
                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            senderName ||
                                                            "User"
                                                        )}`
                                                    }
                                                    alt={
                                                        senderName ||
                                                        "User"
                                                    }
                                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                />

                                                <div>

                                                    <p className="text-xs font-semibold text-slate-600 mb-1 ml-1">
                                                        {senderName ||
                                                            "User"}
                                                    </p>

                                                    <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">

                                                        <p className="text-sm whitespace-pre-wrap break-words">
                                                            {message.text}
                                                        </p>

                                                        <p className="text-[11px] text-slate-400 mt-1">
                                                            {new Date(
                                                                message.createdAt
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>
                                        )}


                                        {/* MY MESSAGE */}

                                        {isMine && (

                                            <div className="max-w-[88%] sm:max-w-[75%]">

                                                <div className="bg-emerald-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">

                                                    <p className="text-sm whitespace-pre-wrap break-words">
                                                        {message.text}
                                                    </p>

                                                    <p className="text-[11px] text-emerald-100 mt-1 text-right">
                                                        {new Date(
                                                            message.createdAt
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>

                                                </div>

                                            </div>
                                        )}

                                    </div>
                                );
                            })
                        )}

                        <div ref={messagesEndRef} />

                    </div>


                    {/* INPUT */}

                    <form
    onSubmit={handleSend}
    className="border-t bg-white p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
>

                        <input
                            type="text"
                            value={text}
                            onChange={(e) =>
                                setText(e.target.value)
                            }
                            placeholder="Type a message..."
                            maxLength={2000}
                            className="
    flex-1
    min-w-0
    border
    border-slate-300
    rounded-xl
    px-3
    sm:px-4
    py-3
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-emerald-500
"
                        />

                        <button
                            type="submit"
                            disabled={
                                sending ||
                                !text.trim()
                            }
                            className="
    shrink-0
    px-4
    sm:px-5
    py-3
    rounded-xl
    bg-emerald-600
    text-white
    font-medium
    hover:bg-emerald-700
    disabled:opacity-50
    disabled:cursor-not-allowed
"
                        >
                            {sending
                                ? "..."
                                : "Send"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}