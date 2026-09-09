import { useState } from "react";
import requestAPI from "../../api/request.api";

export default function RequestModal({
    open,
    onClose,
    mentor,
    mySkills = [],
}) {

    const [skillId, setSkillId] = useState("");

    const [requestType, setRequestType] = useState("CREDITS");

    const [exchangeSkillId, setExchangeSkillId] = useState("");

    const [preferredSchedule, setPreferredSchedule] = useState("");

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const selectedTeachingSkill =
    mentor?.skillsTeach?.find(
        (item) =>
            item.skill?._id === skillId
    );

    const handleSubmit = async () => {

        if (!skillId) {
            alert("Please select a skill.");
            return;
        }

        if (
            requestType === "EXCHANGE" &&
            !exchangeSkillId
        ) {
            alert("Please select your exchange skill.");
            return;
        }

        try {

            setLoading(true);

            await requestAPI.createRequest({

                mentorId: mentor._id,

                skillId,

                requestType,

                exchangeSkillId:
                    requestType === "EXCHANGE"
                        ? exchangeSkillId
                        : null,

                preferredSchedule,

                message,

            });

            alert("Learning request sent successfully.");

            onClose();

        } catch (err) {

            alert(
                err?.response?.data?.message ||
                "Failed to send request."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 sm:p-5">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Request Learning Session
                </h2>

                {/* Skill */}

                <label className="font-medium">
                    Skill
                </label>

                <select
                    className="w-full border rounded-lg p-3 mt-2 mb-5"
                    value={skillId}
                    onChange={(e) =>
                        setSkillId(e.target.value)
                    }
                >

                    <option value="">
                        Select Skill
                    </option>

                    {mentor.skillsTeach.map((item) => (

                        <option
                            key={item.skill._id}
                            value={item.skill._id}
                        >
                            {item.skill.name}
                        </option>

                    ))}

                    

                </select>

                {requestType === "CREDITS" &&
    selectedTeachingSkill && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-5">

            <p className="text-sm text-slate-600">
                Session cost
            </p>

            <p className="text-xl font-bold text-emerald-700 mt-1">
                {selectedTeachingSkill.creditCost} credits
            </p>

            <p className="text-xs text-slate-500 mt-1">
                per learning session
            </p>

        </div>
)}

                {/* Request Type */}

                <label className="font-medium">
                    Request Type
                </label>

                <select
                    className="w-full border rounded-lg p-3 mt-2 mb-5"
                    value={requestType}
                    onChange={(e) =>
                        setRequestType(e.target.value)
                    }
                >

                    <option value="CREDITS">
                        Credits
                    </option>

                    <option value="EXCHANGE">
                        Skill Exchange
                    </option>

                </select>

                {/* Exchange Skill */}

                {requestType === "EXCHANGE" && (

                    <>

                        <label className="font-medium">
                            Your Skill
                        </label>

                        <select
                            className="w-full border rounded-lg p-3 mt-2 mb-5"
                            value={exchangeSkillId}
                            onChange={(e) =>
                                setExchangeSkillId(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Skill
                            </option>

                            {mySkills.map((item) => (

                                <option
                                    key={item.skill._id}
                                    value={item.skill._id}
                                >
                                    {item.skill.name}
                                </option>

                            ))}

                        </select>

                    </>

                )}

                {/* Preferred Schedule */}

                <label className="font-medium">
                    Preferred Schedule
                </label>

                <input
                    type="text"
                    placeholder="Weekdays after 7 PM"
                    className="w-full border rounded-lg p-3 mt-2 mb-5"
                    value={preferredSchedule}
                    onChange={(e) =>
                        setPreferredSchedule(
                            e.target.value
                        )
                    }
                />

                {/* Message */}

                <label className="font-medium">
                    Message
                </label>

                <textarea
                    rows="4"
                    placeholder="Write a short message..."
                    className="w-full border rounded-lg p-3 mt-2"
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                />

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto bg-emerald-600 text-white px-5 py-2.5 rounded-lg"
                    >
                        {loading
                            ? "Sending..."
                            : "Send Request"}
                    </button>

                </div>

            </div>

        </div>

    );

}