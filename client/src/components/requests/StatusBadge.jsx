export default function StatusBadge({ status }) {

    const normalizedStatus = status?.toUpperCase();

    const styles = {
        PENDING: "bg-yellow-100 text-yellow-700",
        ACCEPTED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
        CANCELLED: "bg-gray-100 text-gray-700",
        COMPLETED: "bg-blue-100 text-blue-700",
    };

    const labels = {
        PENDING: "Pending",
        ACCEPTED: "Accepted",
        REJECTED: "Rejected",
        CANCELLED: "Cancelled",
        COMPLETED: "Completed",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
                styles[normalizedStatus] ||
                "bg-gray-100 text-gray-700"
            }`}
        >
            {labels[normalizedStatus] || status}
        </span>
    );
}