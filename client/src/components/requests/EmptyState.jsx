export default function EmptyState({

    message,

}) {

    return (

        <div className="bg-white rounded-xl shadow p-6 sm:p-10 text-center">

            <h2 className="text-xl sm:text-2xl font-semibold">

                No Requests

            </h2>

            <p className="text-slate-500 mt-3">

                {message}

            </p>

        </div>

    );

}