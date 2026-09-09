import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import mentorAPI from "../../api/mentor.api";
import Loader from "../../components/ui/Loader";
import RequestModal from "../../components/requests/RequestModal";
import ReviewList from "../../components/reviews/ReviewList";

export default function MentorProfile() {

    const { id } = useParams();

    const [mentor, setMentor] = useState(null);

    const [loading, setLoading] = useState(true);

    const [openRequest, setOpenRequest] = useState(false);

    useEffect(() => {

        loadProfile();

    }, [id]);

    async function loadProfile() {

        try {

            const res = await mentorAPI.getProfile(id);
            console.log(res);
            setMentor(res.mentor);

        }

        catch (error) {

    const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

    alert(message);

}

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return <Loader/>;

    }

    return (
    <div className="w-full max-w-5xl mx-auto">

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">

            {/* PROFILE HEADER */}

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">

                <img
                    src={
                        mentor.profilePhoto ||
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(mentor.name)
                    }
                    alt={mentor.name}
                    className="
                        w-24
                        h-24
                        sm:w-28
                        sm:h-28
                        rounded-full
                        border
                        object-cover
                        shrink-0
                    "
                />

                <div className="text-center sm:text-left min-w-0">

                    <h1 className="text-2xl sm:text-3xl font-bold break-words">
                        {mentor.name}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                        {mentor.role}
                    </p>

                    <p className="mt-2 text-sm sm:text-base">
                        ⭐ {mentor.averageRating.toFixed(1)}
                        {" "}
                        ({mentor.totalReviews} Reviews)
                    </p>

                </div>

            </div>


            <hr className="my-6 sm:my-8" />


            {/* BIO */}

            <section>

                <h2 className="text-lg sm:text-xl font-semibold mb-3">
                    Bio
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-words">
                    {mentor.bio || "No bio added yet."}
                </p>

            </section>


            <hr className="my-6 sm:my-8" />


            {/* TEACHING SKILLS */}

            <section>

                <h2 className="text-lg sm:text-xl font-semibold mb-3">
                    Skills I Teach
                </h2>

                <div className="flex flex-wrap gap-2">

                    {mentor.skillsTeach.map((item) => (

                        <span
                            key={item.skill._id}
                            className="
                                bg-emerald-100
                                text-emerald-700
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                sm:text-sm
                                max-w-full
                                break-words
                            "
                        >
                            {item.skill.name}
                        </span>

                    ))}

                </div>

            </section>


            <hr className="my-6 sm:my-8" />


            {/* LEARNING SKILLS */}

            <section>

                <h2 className="text-lg sm:text-xl font-semibold mb-3">
                    Skills I Want To Learn
                </h2>

                <div className="flex flex-wrap gap-2">

                    {mentor.skillsLearn.map((item) => (

                        <span
                            key={item.skill._id}
                            className="
                                bg-blue-100
                                text-blue-700
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                sm:text-sm
                                max-w-full
                                break-words
                            "
                        >
                            {item.skill.name}
                        </span>

                    ))}

                </div>

            </section>


            <hr className="my-6 sm:my-8" />


            {/* AVAILABILITY */}

            <section>

                <h2 className="text-lg sm:text-xl font-semibold mb-3">
                    Availability
                </h2>

                <p className="text-sm sm:text-base break-words">
                    {mentor.availability || "Not mentioned"}
                </p>

            </section>


            <hr className="my-6 sm:my-8" />


            {/* LINKS */}

            <div className="flex flex-wrap gap-3 sm:gap-5">

                {mentor.github && (
                    <a
                        href={mentor.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm sm:text-base"
                    >
                        GitHub
                    </a>
                )}

                {mentor.linkedin && (
                    <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm sm:text-base"
                    >
                        LinkedIn
                    </a>
                )}

                {mentor.portfolio && (
                    <a
                        href={mentor.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm sm:text-base"
                    >
                        Portfolio
                    </a>
                )}

            </div>


            {/* REVIEWS */}

            <section className="mt-8 sm:mt-10">

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                    mb-5
                ">

                    <h2 className="text-xl sm:text-2xl font-bold">
                        Reviews
                    </h2>

                    <div className="text-sm sm:text-base text-slate-600">
                        ⭐ {mentor.averageRating || 0}
                        {" "}
                        ({mentor.totalReviews || 0} reviews)
                    </div>

                </div>

                <ReviewList
                    mentorId={mentor._id}
                />

            </section>


            {/* REQUEST */}

            <button
                onClick={() =>
                    setOpenRequest(true)
                }
                className="
                    mt-8
                    w-full
                    bg-emerald-600
                    hover:bg-emerald-700
                    text-white
                    py-3
                    rounded-lg
                    transition
                    text-sm
                    sm:text-base
                "
            >
                Request Session
            </button>


            <RequestModal
                open={openRequest}
                onClose={() =>
                    setOpenRequest(false)
                }
                mentor={mentor}
            />

        </div>

    </div>
);
}