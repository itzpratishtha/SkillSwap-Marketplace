import { useNavigate } from "react-router-dom";
import requestAPI from "../../api/request.api";
import StatusBadge from "./StatusBadge";

export default function RequestCard({
    request,
    tab,
    reload,
}) {
    const navigate = useNavigate();

    const otherUser =
        tab === "sent"
            ? request.mentor
            : request.learner;

    async function handleAccept() {
        try {
            await requestAPI.acceptRequest(request._id);

            alert("Request accepted successfully.");

            await reload();
        } catch (error) {
    console.log(
        "ACCEPT REQUEST ERROR:",
        error.response?.data
    );

    alert(
        error.response?.data?.message ||
        "Unable to accept request."
    );
}
        }

    async function handleRejectOrCancel() {
        const action =
            tab === "received"
                ? "reject"
                : "cancel";

        const confirmed = window.confirm(
            action === "reject"
                ? "Are you sure you want to reject this request?"
                : "Are you sure you want to cancel this request?"
        );

        if (!confirmed) return;

        try {
            await requestAPI.rejectRequest(request._id);

            alert(
                action === "reject"
                    ? "Request rejected."
                    : "Request cancelled."
            );

            await reload();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                `Unable to ${action} request.`
            );
        }
    }

    function handleViewProfile() {
        if (!otherUser?._id) return;

        navigate(`/user/${otherUser._id}`);
    }

    function handleViewSessions() {
        navigate("/sessions");
    }

    const status = request.status?.toUpperCase();

const isPending = status === "PENDING";

const isAccepted = status === "ACCEPTED";

    return (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 min-w-0">

            {/* USER + SKILL */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

                <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                    <img
                        src={
                            otherUser?.profilePhoto ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                otherUser?.name || "User"
                            )}`
                        }
                        alt={otherUser?.name || "User"}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0"
                    />

                    <div className="min-w-0">
    <h2 className="text-base sm:text-lg font-semibold truncate">
        {otherUser?.name || "Unknown User"}
    </h2>

    <p className="text-xs sm:text-sm text-slate-500">
        {tab === "sent" ? "Mentor" : "Learner"}
    </p>
</div>

                </div>

                <StatusBadge status={request.status} />

            </div>

            {/* SKILL */}
            <div className="mt-5">

                <p className="text-sm text-slate-500">
                    Skill
                </p>

                <p className="font-semibold text-lg">
                    {request.skill?.name || "Unknown Skill"}
                </p>

            </div>

            {/* REQUEST TYPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-5">

                <div>

                    <p className="text-sm text-slate-500">
                        Request Type
                    </p>

                    <p className="font-medium">
                        {request.requestType}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Preferred Schedule
                    </p>

                    <p className="font-medium">
                        {request.preferredSchedule || "Not specified"}
                    </p>

                </div>

            </div>

            {/* EXCHANGE SKILL */}
            {request.exchangeSkill && (
                <div className="mt-5">

                    <p className="text-sm text-slate-500">
                        Exchange Skill
                    </p>

                    <p className="font-medium">
                        {request.exchangeSkill.name}
                    </p>

                </div>
            )}

            {/* MESSAGE */}
            {request.message && (
                <div className="mt-5">

                    <p className="text-sm text-slate-500">
                        Message
                    </p>

                    <p className="mt-1 text-slate-700">
                        "{request.message}"
                    </p>

                </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mt-7">

                {/* EVERYONE CAN VIEW THE OTHER USER */}
                <button
                    onClick={handleViewProfile}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                    View Profile
                </button>

                {/* RECEIVED + PENDING */}
                {tab === "received" && isPending && (
                    <>
                        <button
                            onClick={handleAccept}
                            className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Accept
                        </button>

                        <button
                            onClick={handleRejectOrCancel}
                            className="w-full sm:w-auto px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Reject
                        </button>
                    </>
                )}

                {/* SENT + PENDING */}
                {tab === "sent" && isPending && (
                    <button
                        onClick={handleRejectOrCancel}
                        className="w-full sm:w-auto px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Cancel Request
                    </button>
                )}

                {/* ACCEPTED */}
                {isAccepted && (
                    <button
                        onClick={handleViewSessions}
                        className="w-full sm:w-auto px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        View Session
                    </button>
                )}

                {isAccepted && (
                    <button
                        onClick={() =>
                        navigate(`/messages/${request._id}`)
                     }
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                Message
            </button>
        )}

            </div>

        </div>
    );
}