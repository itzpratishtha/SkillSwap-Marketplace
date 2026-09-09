import { useState } from "react";
import sessionAPI from "../../api/session.api";
import SessionStatusBadge from "./SessionStatusBadge";
import ScheduleSessionModal from "./ScheduleSessionModal";
import ReviewModal from "../reviews/ReviewModal";

export default function SessionCard({
    session,
    tab,
    reload,
}) {
    const [openSchedule, setOpenSchedule] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [openReview, setOpenReview] = useState(false);
    const otherUser =
        tab === "learning"
            ? session.mentor
            : session.learner;

    const isMentor = tab === "teaching";

    const isCompleted =
        session.status === "Completed";

    const isScheduled =
        session.status === "Scheduled" &&
        !!session.scheduledAt;

    // ------------------------------------------------
    // Calculate whether the scheduled session has ended
    // ------------------------------------------------

    const sessionHasEnded = (() => {
        if (!session.scheduledAt) return false;

        const start = new Date(session.scheduledAt);

        const duration =
            Number(session.duration) || 60;

        const end = new Date(
            start.getTime() +
            duration * 60 * 1000
        );

        return new Date() >= end;
    })();

    // ------------------------------------------------
    // Has current user already confirmed?
    // ------------------------------------------------

    const currentUserCompleted =
        isMentor
            ? session.mentorCompleted
            : session.learnerCompleted;

    const otherUserCompleted =
        isMentor
            ? session.learnerCompleted
            : session.mentorCompleted;

    // ------------------------------------------------
    // Complete session
    // ------------------------------------------------

    async function handleComplete() {
        try {
            setCompleting(true);

            const response =
                await sessionAPI.completeSession(
                    session._id
                );

            alert(
                response.message ||
                "Session completion recorded."
            );

            await reload();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to complete session."
            );

        } finally {

            setCompleting(false);

        }
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition min-w-0">

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

                    <div className="flex gap-3 sm:gap-4 min-w-0">

                        <img
                            src={
                                otherUser?.profilePhoto ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    otherUser?.name || "User"
                                )}`
                            }
                            alt={otherUser?.name || "User"}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                        />

                        <div>

                            <h2 className="text-lg sm:text-xl font-bold break-words">
                                {session.skill?.name || "Learning Session"}
                            </h2>

                            <p className="text-slate-500">
                                {isMentor
                                    ? "Learner"
                                    : "Mentor"}
                            </p>

                            <p className="font-medium">
                                {otherUser?.name || "Unknown User"}
                            </p>

                        </div>

                    </div>

                    <SessionStatusBadge
                        status={session.status}
                        scheduledAt={session.scheduledAt}
                    />

                </div>

                <hr className="my-5" />

                {/* =========================================
                    SESSION DETAILS
                ========================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                    <div>

                        <p className="text-slate-500 text-sm">
                            Date
                        </p>

                        <p>
                            {session.scheduledAt
                                ? new Date(
                                      session.scheduledAt
                                  ).toLocaleDateString()
                                : "Not Scheduled"}
                        </p>

                    </div>

                    <div>

                        <p className="text-slate-500 text-sm">
                            Time
                        </p>

                        <p>
                            {session.scheduledAt
                                ? new Date(
                                      session.scheduledAt
                                  ).toLocaleTimeString(
                                      [],
                                      {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      }
                                  )
                                : "--"}
                        </p>

                    </div>

                    <div>

                        <p className="text-slate-500 text-sm">
                            Duration
                        </p>

                        <p>
                            {session.duration || 60} minutes
                        </p>

                    </div>

                    <div>

                        <p className="text-slate-500 text-sm">
                            Mode
                        </p>

                        <p>
                            {session.mode || "ONLINE"}
                        </p>

                    </div>

                </div>

                {/* =========================================
                    ONLINE MEETING
                ========================================= */}

                {isScheduled &&
                    session.mode === "ONLINE" &&
                    session.meetingLink && (

                        <div className="mt-6">

                            <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700"
                            >
                                Join Session
                            </a>

                        </div>
                    )}

                {/* =========================================
                    OFFLINE LOCATION
                ========================================= */}

                {isScheduled &&
                    session.mode === "OFFLINE" &&
                    session.location && (

                        <div className="mt-6">

                            <p className="text-slate-700">
                                📍 {session.location}
                            </p>

                        </div>
                    )}

                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mt-8">

                    {/* -------------------------------------
                        MENTOR: SESSION NEEDS SCHEDULING
                    ------------------------------------- */}

                    {isMentor &&
                        !session.scheduledAt &&
                        !isCompleted && (

                            <button
                                onClick={() =>
                                    setOpenSchedule(true)
                                }
                                className="w-full sm:flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700"
                            >
                                Schedule Session
                            </button>
                        )}

                    {/* -------------------------------------
                        SESSION HAS NOT ENDED
                    ------------------------------------- */}

                    {isScheduled &&
                        !sessionHasEnded &&
                        !isCompleted && (

                            <div className="w-full">

                                <p className="text-sm text-slate-500">
                                    Session is scheduled. You can mark it
                                    complete after the scheduled end time.
                                </p>

                            </div>
                        )}

                    {/* -------------------------------------
                        CURRENT USER CAN MARK COMPLETE
                    ------------------------------------- */}

                    {isScheduled &&
                        sessionHasEnded &&
                        !isCompleted &&
                        !currentUserCompleted && (

                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="w-full sm:flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700"
                            >
                                {completing
                                    ? "Confirming..."
                                    : "Mark Session Complete"}
                            </button>
                        )}

                    {/* -------------------------------------
                        CURRENT USER ALREADY CONFIRMED
                    ------------------------------------- */}

                    {isScheduled &&
                        sessionHasEnded &&
                        !isCompleted &&
                        currentUserCompleted && (

                            <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">

                                <p className="text-green-700 font-medium">
                                    ✓ You marked this session as completed.
                                </p>

                                {!otherUserCompleted && (
                                    <p className="text-sm text-green-600 mt-1">
                                        Waiting for the other participant
                                        to confirm.
                                    </p>
                                )}

                            </div>
                        )}

                    {/* -------------------------------------
                        OTHER USER CONFIRMED FIRST
                    ------------------------------------- */}

                    {isScheduled &&
                        sessionHasEnded &&
                        !isCompleted &&
                        !currentUserCompleted &&
                        otherUserCompleted && (

                            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">

                                <p className="text-blue-700 font-medium">
                                    The other participant has marked this
                                    session as completed.
                                </p>

                                <p className="text-sm text-blue-600 mt-1">
                                    Please confirm the session to complete
                                    it for both participants.
                                </p>

                            </div>
                        )}

                    {/* -------------------------------------
                        COMPLETED
                    ------------------------------------- */}

                    {isCompleted && (

                        <div className="w-full">

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">

                                <p className="text-green-700 font-semibold">
                                    ✓ Session Completed
                                </p>

                                <p className="text-sm text-green-600 mt-1">
                                    Both participants have confirmed
                                    completion.
                                </p>

                            </div>

                        </div>
                    )}

                    {/* -------------------------------------
                        LEARNER → REVIEW
                    ------------------------------------- */}

                    {!isMentor &&
                        isCompleted && (

                            <button
                            onClick={() => setOpenReview(true)}
                            className="w-full sm:flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700"
                            >
                                ⭐ Give Review
                            </button>
                        )}

                </div>

            </div>

            {/* =========================================
                SCHEDULE MODAL
            ========================================= */}

            <ScheduleSessionModal
                open={openSchedule}
                onClose={() =>
                    setOpenSchedule(false)
                }
                session={session}
                reload={reload}
            />

            <ReviewModal
                open={openReview}
                onClose={() => setOpenReview(false)}
                learningRequestId={session.learningRequest}
                mentorName={session.mentor?.name}
                onSuccess={reload}
            />

        </>
    );
}