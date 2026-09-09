export default function EmptySessions({

    tab,

}) {

    return (

        <div className="bg-white rounded-xl shadow p-6 sm:p-12 text-center">

            <h2 className="text-xl sm:text-2xl font-semibold">

                No Sessions

            </h2>

            <p className="text-slate-500 mt-3">

                {

                    tab === "learning"

                    ? "You don't have any learning sessions yet."

                    : "You don't have any teaching sessions yet."

                }

            </p>

        </div>

    );

}