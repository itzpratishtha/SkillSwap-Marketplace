import { Star } from "lucide-react";

export default function TeacherCard({
    teacher,
    onRequest,
    onViewProfile,
}) {

    return (

        <div className="
            bg-white
            rounded-xl
            shadow-md
            p-4
            sm:p-6
            hover:shadow-lg
            transition
            flex
            flex-col
            min-w-0
        ">

            {/* HEADER */}

            <div className="flex justify-between items-start gap-3">

                <div className="min-w-0">

                    <h2 className="
                        text-lg
                        sm:text-xl
                        font-bold
                        truncate
                    ">
                        {teacher.name}
                    </h2>

                    <p className="
                        text-sm
                        sm:text-base
                        text-slate-500
                        truncate
                    ">
                        {teacher.role}
                    </p>

                </div>


                <div className="
                    flex
                    items-center
                    gap-1
                    shrink-0
                    text-sm
                ">

                    <Star
                        size={17}
                        className="text-yellow-500 fill-yellow-500"
                    />

                    <span>
                        {teacher.averageRating.toFixed(1)}
                    </span>

                </div>

            </div>


            {/* BIO */}

            <p className="
                text-sm
                sm:text-base
                text-slate-600
                mt-4
                line-clamp-3
            ">
                {teacher.bio ||
                    "No bio added yet."}
            </p>


            {/* TEACHING SKILLS */}

            <div className="mt-5">

                <h3 className="
                    font-semibold
                    text-sm
                    sm:text-base
                    mb-2
                ">
                    Teaching
                </h3>


                <div className="flex flex-wrap gap-2">

                    {teacher.skillsTeach.map(
                        (item) => (

                            <span
                                key={item.skill._id}
                                className="
                                    px-2.5
                                    sm:px-3
                                    py-1
                                    rounded-full
                                    bg-emerald-100
                                    text-emerald-700
                                    text-xs
                                    sm:text-sm
                                    max-w-full
                                    truncate
                                "
                            >
                                {item.skill.name}
                            </span>

                        )
                    )}

                </div>

            </div>


            {/* ACTIONS */}

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-2
                sm:gap-3
                mt-6
                pt-1
            ">

                <button
                    onClick={() =>
                        onViewProfile(teacher)
                    }
                    className="
                        w-full
                        border
                        rounded-lg
                        py-2.5
                        px-3
                        text-sm
                        sm:text-base
                        hover:bg-slate-50
                        transition
                    "
                >
                    View Profile
                </button>


                <button
                    onClick={() =>
                        onRequest(teacher)
                    }
                    className="
                        w-full
                        bg-emerald-600
                        hover:bg-emerald-700
                        text-white
                        rounded-lg
                        py-2.5
                        px-3
                        text-sm
                        sm:text-base
                        transition
                    "
                >
                    Request
                </button>

            </div>

        </div>

    );

}