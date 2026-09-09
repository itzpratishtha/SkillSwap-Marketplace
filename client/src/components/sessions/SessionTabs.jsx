export default function SessionTabs({

    tab,

    setTab,

}) {

    return (

        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 mb-6 sm:mb-8">

            <button

                onClick={() => setTab("learning")}

                className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-lg transition ${
                    tab === "learning"

                        ? "bg-emerald-600 text-white"

                        : "bg-gray-200"
                }`}
            >

                I'm Learning

            </button>

            <button

                onClick={() => setTab("teaching")}

                className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-lg transition ${
                    tab === "teaching"

                        ? "bg-emerald-600 text-white"

                        : "bg-gray-200"
                }`}
            >

                I'm Teaching

            </button>

        </div>

    );

}