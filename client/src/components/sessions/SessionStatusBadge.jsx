export default function SessionStatusBadge({ status, scheduledAt }) {

    // Session exists but mentor has not scheduled it yet
    if (!scheduledAt) {
        return (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                Needs Scheduling
            </span>
        );
    }

    const styles = {
        Scheduled: "bg-blue-100 text-blue-700",
        Completed: "bg-green-100 text-green-700",
        Cancelled: "bg-gray-200 text-gray-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
                styles[status] || "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </span>
    );
}