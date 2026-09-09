import {
    useEffect,
    useRef,
    useState,
} from "react";

import { chatWithAI } from "../../api/ai.api";
import ReactMarkdown from "react-markdown";


const AIAssistant = () => {

    // ==========================================
    // CHAT WINDOW STATE
    // ==========================================

    const [isOpen, setIsOpen] =
        useState(false);


    // ==========================================
    // MESSAGES STATE
    // ==========================================

    const [messages, setMessages] =
        useState([
            {
                role: "assistant",
                content:
                    "Hi! 👋 I'm SkillSwap AI. I can help you understand concepts, plan your learning journey, explore skills, and answer questions about SkillSwap. How can I help you today?",
            },
        ]);

    const suggestedQuestions = [

    "What should I learn next?",

    "Help me plan my learning journey",

    "Explain a concept in simple language",

    "How does SkillSwap work?",

];


    // ==========================================
    // INPUT STATE
    // ==========================================

    const [input, setInput] =
        useState("");


    // ==========================================
    // LOADING STATE
    // ==========================================

    const [isLoading, setIsLoading] =
        useState(false);


    // ==========================================
    // ERROR STATE
    // ==========================================

    const [error, setError] =
        useState("");

    const messagesEndRef =
    useRef(null);


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const handleSendMessage =
        async (customMessage = null) => {

            const message =
                (
                    customMessage ||
                    input
                ).trim();


            // Prevent empty messages
            if (
                !message ||
                isLoading
            ) {
                return;
            }


            setError("");


            // ==================================
            // CREATE USER MESSAGE
            // ==================================

            const userMessage = {

                role: "user",

                content: message,

            };


            // Save previous messages for API
            const previousMessages =
                messages;


            // Add user message immediately
            setMessages(
                (prev) => [

                    ...prev,

                    userMessage,

                ]
            );


            // Clear input
            setInput("");


            // Show loading
            setIsLoading(true);


            try {

                // ==============================
                // CALL AI BACKEND
                // ==============================

                const response =
                    await chatWithAI(

                        message,

                        previousMessages

                    );


                // ==============================
                // ADD AI RESPONSE
                // ==============================

                if (
                    response.success &&
                    response.reply
                ) {

                    setMessages(
                        (prev) => [

                            ...prev,

                            {
                                role:
                                    "assistant",

                                content:
                                    response.reply,

                            },

                        ]
                    );

                } else {

                    throw new Error(

                        response.message ||
                        "AI did not return a response."

                    );

                }

            } catch (err) {

                console.error(
                    "AI CHAT ERROR:",
                    err
                );


                const errorMessage =
                    err.response?.data
                        ?.message ||
                    err.message ||
                    "Unable to connect to SkillSwap AI.";


                setError(
                    errorMessage
                );

            } finally {

                setIsLoading(
                    false
                );

            }

        };


    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown =
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                handleSendMessage();

            }

        };
        useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

        behavior: "smooth",

    });

}, [

    messages,

    isLoading,

]);


    return (

        <>
            {/* ======================================
                FLOATING AI BUTTON
            ====================================== */}

            <button
                onClick={() =>
                    setIsOpen(
                        (prev) => !prev
                    )
                }
                className="
    fixed
    bottom-4
    right-4

    sm:bottom-6
    sm:right-6

    z-[100]

    w-14
    h-14

    sm:w-16
    sm:h-16

    rounded-full

    bg-indigo-600
    text-white

    shadow-xl

    flex
    items-center
    justify-center

    text-2xl

    hover:scale-105
    active:scale-95

    transition
"
                aria-label="Open SkillSwap AI"
            >

                🤖

            </button>


            {/* ======================================
                CHAT WINDOW
            ====================================== */}

            {
                isOpen && (

                    <div
    className="
        fixed

        inset-0

        sm:inset-auto
        sm:bottom-24
        sm:right-6

        z-[100]

        w-full
        h-[100dvh]

        sm:w-[380px]
        sm:max-w-[calc(100vw-2rem)]

        sm:h-auto

        bg-white

        rounded-none
        sm:rounded-2xl

        shadow-2xl

        sm:border

        overflow-hidden

        flex
        flex-col
    "
>


                        {/* ==================================
                            HEADER
                        ================================== */}

                        <div
    className="
        flex
        items-center
        justify-between

        p-3
        sm:p-4

        bg-indigo-600
        text-white

        flex-shrink-0
    "
>
                            <div>

                                <h2
    className="
        font-semibold
        text-sm
        sm:text-base
    "
>
    🤖 SkillSwap AI
</h2>

<p
    className="
        text-[10px]
        sm:text-xs

        opacity-80
    "
>
    Your personalized learning assistant
</p>

                            </div>


                            <button
                                onClick={() =>
                                    setIsOpen(false)
                                }
                                className="
                                    text-xl
                                    hover:opacity-70
                                    transition
                                "
                                aria-label="Close AI assistant"
                            >
                                ✕
                            </button>

                        </div>


                        {/* ==================================
                            MESSAGES
                        ================================== */}

                        <div
    className="
        flex-1

        sm:flex-none
        sm:h-[420px]

        overflow-y-auto

        p-3
        sm:p-4

        space-y-4

        min-h-0
    "
>

                            {
                                messages.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            className={`
                                                flex
                                                ${
                                                    item.role === "user"
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    max-w-[85%]
                                                    sm:max-w-[80%]

                                                    rounded-2xl

                                                    px-4
                                                    py-3

                                                    text-sm

                                                

                                                    ${
                                                        item.role === "user"
                                                            ? `
                                                                bg-indigo-600
                                                                text-white
                                                                rounded-br-sm
                                                            `
                                                            : `
                                                                bg-slate-100
                                                                text-slate-800
                                                                rounded-bl-sm
                                                            `
                                                    }
                                                `}
                                            >

                                                <ReactMarkdown>
                                                    {item.content}
                                                </ReactMarkdown>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                            {
    messages.length === 1 &&
    !isLoading && (

        <div
            className="
                grid
                grid-cols-1
                gap-2
                mt-4
            "
        >

            <p
                className="
                    text-xs
                    text-slate-400
                    mb-1
                "
            >
                Try asking:
            </p>


            {
                suggestedQuestions.map(
                    (question) => (

                        <button
                            key={question}

                            onClick={() =>
                                handleSendMessage(
                                    question
                                )
                            }

                            className="
                                text-left

                                px-3
                                py-2

                                rounded-xl

                                border

                                text-sm
                                text-slate-600

                                hover:
                                bg-indigo-50

                                hover:
                                border-indigo-300

                                transition
                            "
                        >
                            ✨ {question}
                        </button>

                    )
                )
            }

        </div>

    )
}


                            {/* ==============================
                                LOADING
                            ============================== */}

                            {
                                isLoading && (

                                    <div
                                        className="
                                            flex
                                            justify-start
                                        "
                                    >

                                        <div
                                            className="
                                                bg-slate-100

                                                rounded-2xl
                                                rounded-bl-sm

                                                px-4
                                                py-3

                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            🤖 Thinking...
                                        </div>

                                    </div>

                                )
                            }


                            {/* ==============================
                                ERROR
                            ============================== */}

                            {
                                error && (

                                    <div
                                        className="
                                            text-xs

                                            text-red-500

                                            bg-red-50

                                            p-3

                                            rounded-lg
                                        "
                                    >
                                        {error}
                                    </div>

                                )
                            }
                            <div ref={messagesEndRef} />

                        </div>


                        {/* ==================================
                            INPUT
                        ================================== */}

                        <div
    className="
        border-t

        p-3

        flex
        items-end

        gap-2

        bg-white

        flex-shrink-0
    "
>

<textarea
    value={input}

    onChange={(event) =>
        setInput(event.target.value)
    }

    onKeyDown={handleKeyDown}

    placeholder="Ask anything..."

    disabled={isLoading}

    className="
        flex-1

        min-w-0

        h-12
        sm:h-14

        resize-none

        overflow-y-auto

        border

        rounded-xl

        px-3
        pt-3
        pb-2

        text-sm
        leading-5

        outline-none

        focus:ring-2
        focus:ring-indigo-500

        placeholder:text-slate-400
    "
/>


                            <button
                                onClick={
                                    () =>
                                        handleSendMessage()
                                }

                                disabled={
                                    isLoading ||
                                    !input.trim()
                                }


className="
    w-11
    h-11

    sm:w-auto
    sm:h-auto

    sm:px-4
    sm:py-3

    flex
    items-center
    justify-center

    flex-shrink-0

    rounded-xl

    bg-indigo-600
    text-white

    text-lg

    disabled:opacity-50

    hover:bg-indigo-700

    transition
"
                            >
                                ➤
                            </button>

                        </div>

                    </div>

                )
            }

        </>

    );

};


export default AIAssistant;