import { useState } from "react";
import reviewAPI from "../../api/review.api";

export default function ReviewModal({
    open,
    onClose,
    learningRequestId,
    mentorName,
    onSuccess,
}) {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    async function handleSubmit() {

        if (!rating) {
            alert("Please select a rating.");
            return;
        }

        try {

            setLoading(true);

            await reviewAPI.addReview({
                learningRequestId,
                rating,
                review: review.trim(),
            });

            alert("Review submitted successfully.");

            setRating(0);
            setReview("");

            onSuccess?.();
            onClose();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to submit review."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-xl font-bold">
                        Leave a Review
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 text-xl"
                    >
                        ×
                    </button>

                </div>

                <p className="text-gray-600 mb-5">
                    How was your learning experience with{" "}
                    <span className="font-semibold">
                        {mentorName || "your mentor"}
                    </span>?
                </p>

                {/* STARS */}

                <div className="flex gap-2 mb-6">

                    {[1, 2, 3, 4, 5].map((star) => (

                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-3xl transition ${
                                star <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                        >
                            ★
                        </button>

                    ))}

                </div>

                {/* REVIEW */}

                <label className="block text-sm font-medium mb-2">
                    Your feedback
                </label>

                <textarea
                    value={review}
                    onChange={(e) =>
                        setReview(e.target.value)
                    }
                    placeholder="Share your experience..."
                    rows={5}
                    className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* ACTIONS */}

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Review"}
                    </button>

                </div>

            </div>

        </div>
    );
}