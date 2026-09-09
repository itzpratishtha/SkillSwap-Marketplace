export default function RequestTabs({
    tab,
    setTab,
}) {

    return (

        <div className="
            grid
            grid-cols-2
            gap-2
            sm:flex
            sm:gap-4
            mb-6
            sm:mb-8
        ">

            <button
                onClick={() => setTab("sent")}
                className={`
                    px-4
                    sm:px-5
                    py-2.5
                    rounded-lg
                    transition
                    text-sm
                    sm:text-base
                    ${
                        tab === "sent"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }
                `}
            >
                Sent
            </button>


            <button
                onClick={() => setTab("received")}
                className={`
                    px-4
                    sm:px-5
                    py-2.5
                    rounded-lg
                    transition
                    text-sm
                    sm:text-base
                    ${
                        tab === "received"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }
                `}
            >
                Received
            </button>

        </div>

    );
}