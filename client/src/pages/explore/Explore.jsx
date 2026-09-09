import { useEffect, useState } from "react";

import exploreAPI from "../../api/explore.api";
import profileAPI from "../../api/profile.api"
import Loader from "../../components/ui/Loader";
import TeacherCard from "../../components/explore/TeacherCard";
import { Link, useNavigate } from "react-router-dom";
import RequestModal from "../../components/requests/RequestModal";

export default function Explore() {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);

    const [selectedSkill, setSelectedSkill] = useState("");

    const [teachers, setTeachers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [openRequest, setOpenRequest] = useState(false);

const [selectedTeacher, setSelectedTeacher] = useState(null);

const [mySkills, setMySkills] = useState([]);

    useEffect(() => {

        loadSkills();
        loadMyProfile();

    }, []);

    async function loadMyProfile() {

    try {

        const res = await profileAPI.getProfile();

        setMySkills(res.user.skillsTeach);

    } catch (err) {

        console.error(err);

    }

}

    async function loadSkills() {

        try {

            const res = await exploreAPI.getSkills();

            setSkills(res.skills);

        }

        catch (error) {

    const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

    alert(message);

}

    }

    async function handleSearch() {

        if (!selectedSkill) return;

        setLoading(true);

        try {

            const res = await exploreAPI.searchTeachers(
                selectedSkill
            );

            setTeachers(res.mentors);

        }

        
        catch (error) {

    const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

    alert(message);

}

        finally {

            setLoading(false);

        }

    }

    return (

    <div className="w-full max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-6 sm:mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold">
                Explore Skills
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-2">
                Find someone who can teach you a skill.
            </p>

        </div>


        {/* SEARCH */}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

            <select
                value={selectedSkill}
                onChange={(e) =>
                    setSelectedSkill(e.target.value)
                }
                className="
                    w-full
                    flex-1
                    border
                    rounded-lg
                    p-3
                    bg-white
                    min-w-0
                "
            >

                <option value="">
                    Select Skill
                </option>

                {skills.map((skill) => (

                    <option
                        key={skill._id}
                        value={skill._id}
                    >
                        {skill.name}
                    </option>

                ))}

            </select>


            <button
                onClick={handleSearch}
                disabled={!selectedSkill || loading}
                className="
                    w-full
                    sm:w-auto
                    bg-emerald-600
                    hover:bg-emerald-700
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    text-white
                    px-6
                    py-3
                    rounded-lg
                    transition
                "
            >
                {loading ? "Searching..." : "Search"}
            </button>

        </div>


        {/* NO RESULTS */}

        {!loading &&
            selectedSkill &&
            teachers.length === 0 && (

                <div className="mt-6 sm:mt-8 rounded-xl border border-dashed border-slate-300 p-6 sm:p-10 text-center">

                    <h3 className="text-base sm:text-lg font-semibold text-slate-700">
                        No teachers found
                    </h3>

                    <p className="mt-2 text-sm sm:text-base text-slate-500">
                        Try searching for another skill.
                    </p>

                </div>
            )
        }


        {/* LOADING */}

        {loading ? (

            <div className="flex justify-center py-12">

                <Loader />

            </div>

        ) : (

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
                sm:gap-6
                mt-6
                sm:mt-8
            ">

                {teachers.map((teacher) => (

                    <TeacherCard
                        key={teacher._id}
                        teacher={teacher}

                        onRequest={(teacher) => {
                            setSelectedTeacher(teacher);
                            setOpenRequest(true);
                        }}

                        onViewProfile={(teacher) => {
                            navigate(
                                `/user/${teacher._id}`
                            );
                        }}
                    />

                ))}

            </div>

        )}


        {/* REQUEST MODAL */}

        {selectedTeacher && (

            <RequestModal
                open={openRequest}

                onClose={() => {
                    setOpenRequest(false);
                    setSelectedTeacher(null);
                }}

                mentor={selectedTeacher}
                mySkills={mySkills}
            />

        )}

    </div>

);

}