import { useState, useEffect } from "react";
import sessionAPI from "../../api/session.api";

export default function ScheduleSessionModal({
    open,
    onClose,
    session,
    reload,
}) {

    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [duration, setDuration] = useState(60);

    const [mode, setMode] = useState("ONLINE");

    const [meetingLink, setMeetingLink] = useState("");

    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!open) return;

        if (session?.scheduledAt) {

            const date = new Date(session.scheduledAt);

            setScheduledDate(
                date.toISOString().split("T")[0]
            );

            setScheduledTime(
                date.toTimeString().slice(0,5)
            );

        }

        setDuration(session?.duration || 60);

        setMode(session?.mode || "ONLINE");

        setMeetingLink(session?.meetingLink || "");

        setLocation(session?.location || "");

    }, [open, session]);

    if (!open) return null;

    async function handleSave() {

        if (!scheduledDate || !scheduledTime) {

            alert("Please select date and time.");

            return;

        }
        if (mode === "ONLINE" && !meetingLink.trim()) {
            alert("Please enter a meeting link.");
            return;
        }

        if (mode === "OFFLINE" && !location.trim()) {
            alert("Please enter the session location.");
            return;
        }

        const scheduledAt = `${scheduledDate}T${scheduledTime}`;

        try {

            setLoading(true);

            await sessionAPI.scheduleSession(
                session._id,
                {
                    scheduledAt: `${scheduledDate}T${scheduledTime}`,
                    duration: Number(duration),
                    mode,
                    meetingLink: mode === "ONLINE"
                        ? meetingLink
                        : "",
                    location: mode === "OFFLINE"
                    ? location
                    : ""
                }
            );

            alert("Session scheduled successfully.");

            reload();

            onClose();

        }

        catch(error){

            alert(

                error.response?.data?.message ||

                "Unable to schedule session."

            );

        }

        finally{

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 sm:p-5">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">

                <h2 className="text-2xl font-bold mb-6">

                    Schedule Session

                </h2>

                <label>Date</label>

                <input
                    type="date"
                    className="w-full border rounded p-3 mt-2 mb-5"
                    value={scheduledDate}
                    onChange={(e)=>
                        setScheduledDate(e.target.value)
                    }
                />

                <label>Time</label>

                <input
                    type="time"
                    className="w-full border rounded p-3 mt-2 mb-5"
                    value={scheduledTime}
                    onChange={(e)=>
                        setScheduledTime(e.target.value)
                    }
                />

                <label>Duration (minutes)</label>

                <input
                    type="number"
                    className="w-full border rounded p-3 mt-2 mb-5"
                    value={duration}
                    onChange={(e)=>
                        setDuration(Number(e.target.value))
                    }
                />

                <label>Mode</label>

                <select
                    className="w-full border rounded p-3 mt-2 mb-5"
                    value={mode}
                    onChange={(e)=>
                        setMode(e.target.value)
                    }
                >

                    <option value="ONLINE">

                        Online

                    </option>

                    <option value="OFFLINE">

                        Offline

                    </option>

                </select>

                {

                    mode==="ONLINE"

                    ?

                    <>

                        <label>Meeting Link</label>

                        <input
                            type="text"
                            className="w-full border rounded p-3 mt-2 mb-5"
                            placeholder="https://meet.google.com/..."
                            value={meetingLink}
                            onChange={(e)=>
                                setMeetingLink(e.target.value)
                            }
                        />

                    </>

                    :

                    <>

                        <label>Location</label>

                        <input
                            type="text"
                            className="w-full border rounded p-3 mt-2 mb-5"
                            placeholder="Room 301..."
                            value={location}
                            onChange={(e)=>
                                setLocation(e.target.value)
                            }
                        />

                    </>

                }

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="border px-5 py-2 rounded-lg"
                    >

                        Cancel

                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-emerald-600 text-white px-5 py-2 rounded-lg"
                    >

                        {

                            loading

                            ?

                            "Saving..."

                            :

                            "Save Session"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}