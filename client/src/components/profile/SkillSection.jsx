import { Trash2 } from "lucide-react";

export default function SkillsSection({
    title,
    skills,
    buttonText,
    onAdd,
    onDelete,
}) {

    return (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">

                <h2 className="text-lg sm:text-xl font-semibold">
                    {title}
                </h2>

                <button
                    type="button"
                    onClick={onAdd}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    {buttonText}
                </button>

            </div>

            {
                skills.length === 0 ? (

                    <p className="text-slate-500">
                        No skills added yet.
                    </p>

                ) : (

                    <div className="space-y-3">

                        {skills.map((item, index) => (

                            <div
                                key={index}
                                className="flex items-center justify-between gap-3 border rounded-lg p-3 sm:p-4 min-w-0"
                            >

                            <div className="min-w-0">
                                    <h3 className="font-semibold truncate">

                                        {item.skill?.name}

                                    </h3>

                                    <p className="text-sm text-slate-500">

                                        {item.level}

                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
                                   className="text-red-500 hover:text-red-700 shrink-0"
                                >

                                    <Trash2 size={18} />

                                </button>

                            </div>

                        ))}

                    </div>

                )
            }

        </div>
    );

}