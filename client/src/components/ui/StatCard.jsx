export default function StatCard({

title,

value,

icon,

color="emerald"

}){

return(

<div
    className="
        bg-white
        rounded-xl
        shadow-sm
        border
        p-5 sm:p-6
        hover:shadow-lg
        transition
        min-w-0
    "
>
    <div className="flex justify-between items-center gap-4">

        <div className="min-w-0">

            <p className="text-sm text-slate-500 truncate">
                {title}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                {value}
            </h2>

        </div>

        <div className="shrink-0">
            {icon}
        </div>

    </div>
</div>

);

}