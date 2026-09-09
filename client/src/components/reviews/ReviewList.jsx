import { useEffect, useState } from "react";
import reviewAPI from "../../api/review.api";

export default function ReviewList({ mentorId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (mentorId) {
            loadReviews();
        }
    }, [mentorId]);

    async function loadReviews() {
        try {
            setLoading(true);

            const response =
                await reviewAPI.getMentorReviews(mentorId);

            setReviews(response.reviews || []);

        } catch (error) {
            console.error("Failed to load reviews:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <p className="text-slate-500">
                Loading reviews...
            </p>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-slate-50 rounded-lg p-6 text-center">
                <p className="text-slate-500">
                    No reviews yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {reviews.map((item) => (

                <div
                    key={item._id}
                    className="border rounded-xl p-5"
                >

                    <div className="flex justify-between">

                        <div>
                            <p className="font-semibold">
                                {item.learner?.name || "Learner"}
                            </p>

                            <div className="text-yellow-400">
                                {"★".repeat(item.rating)}
                                <span className="text-slate-300">
                                    {"★".repeat(5 - item.rating)}
                                </span>
                            </div>
                        </div>

                        <span className="text-sm text-slate-400">
                            {new Date(
                                item.createdAt
                            ).toLocaleDateString()}
                        </span>

                    </div>

                    {item.review && (
                        <p className="mt-3 text-slate-600">
                            "{item.review}"
                        </p>
                    )}

                </div>

            ))}

        </div>
    );
}