import { useEffect, useState } from "react";
import skillAPI from "../../api/skill.api";

export default function AddSkillModal({
    open,
    onClose,
    onSave,
    existingSkills,
    mode = "teach",
}) {

    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [creditCost, setCreditCost] = useState("");


    useEffect(() => {

        if (open) {
            loadSkills();
        }

    }, [open]);


    async function loadSkills() {

        try {

            const res =
                await skillAPI.getSkills();

            setSkills(res.skills);

        } catch (err) {

            console.error(
                "Failed to load skills:",
                err
            );

        }
    }


    function handleAdd() {

        if (!selectedSkill) {

            alert("Please select a skill.");

            return;
        }

        if (mode === "teach") {

    if (
        creditCost === "" ||
        !Number.isInteger(Number(creditCost)) ||
        Number(creditCost) <= 0
    ) {

        alert(
            "Please enter a valid positive whole number for credit cost."
        );

        return;
    }

}


        const skill =
            skills.find(
                (s) =>
                    s._id === selectedSkill
            );


        if (!skill) {

            alert("Selected skill not found.");

            return;
        }


        const exists =
            existingSkills.some(
                (item) =>
                    item.skill._id ===
                    skill._id
            );


        if (exists) {

            alert(
                "Skill already added."
            );

            return;
        }


        onSave({
    skill,
    level,
    ...(mode === "teach"
        ? {
              creditCost:
                  Number(creditCost),
          }
        : {}),
});


        // Reset modal state

        setSelectedSkill("");
        setLevel("Beginner");
        setCreditCost("");

        onClose();
    }


    if (!open) return null;


    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

            <div className="
    bg-white
    rounded-xl
    w-full
    max-w-md
    max-h-[90vh]
    overflow-y-auto
    p-4
    sm:p-6
">

                <h2 className="text-xl font-bold mb-6">
    {mode === "learn"
        ? "Add Learning Skill"
        : "Add Teaching Skill"}
</h2>


                {/* SKILL */}

                <label className="block mb-2 font-medium">
                    Skill
                </label>

                <select
                    value={selectedSkill}
                    onChange={(e) =>
                        setSelectedSkill(
                            e.target.value
                        )
                    }
                    className="w-full border rounded-lg p-3"
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


                {/* LEVEL */}

                <label className="block mt-5 mb-2 font-medium">
                    Level
                </label>

                <select
                    value={level}
                    onChange={(e) =>
                        setLevel(
                            e.target.value
                        )
                    }
                    className="w-full border rounded-lg p-3"
                >

                    <option>
                        Beginner
                    </option>

                    <option>
                        Intermediate
                    </option>

                    <option>
                        Advanced
                    </option>

                    <option>
                        Expert
                    </option>

                </select>


                {/* CREDIT COST */}

                {mode === "teach" && (
    <>
        <label className="block mt-5 mb-2 font-medium">
            Credit Cost per Session
        </label>

        <div className="relative">

            <input
                type="number"
                min="1"
                step="1"
                value={creditCost}
                onChange={(e) =>
                    setCreditCost(e.target.value)
                }
                placeholder="e.g. 10"
                className="w-full border rounded-lg p-3 pr-20"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                credits
            </span>

        </div>

        <p className="text-xs text-slate-500 mt-2">
            This is the number of credits a learner
            will pay for one session.
        </p>
    </>
)}


                {/* ACTIONS */}

                <div className="
    flex
    flex-col-reverse
    sm:flex-row
    sm:justify-end
    gap-2
    sm:gap-3
    mt-8
">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
    w-full
    sm:w-auto
    border
    rounded-lg
    px-5
    py-2.5
"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="
    w-full
    sm:w-auto
    bg-emerald-600
    text-white
    rounded-lg
    px-5
    py-2.5
    hover:bg-emerald-700
"
                    >
                        Add
                    </button>

                </div>

            </div>

        </div>
    );
}