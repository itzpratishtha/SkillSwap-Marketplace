import { useEffect, useState } from "react";

import {
    BookOpen,
    GraduationCap,
    Wallet,
    Calendar,
} from "lucide-react";

import dashboardAPI from "../../api/dashboard.api";
import { Link } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";

export default function Dashboard(){

    const [dashboard,setDashboard]=useState(null);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        fetchDashboard();

    },[]);

    async function fetchDashboard(){

        try{

            const res=
            await dashboardAPI.getDashboard();

            setDashboard(res.dashboard);

        }catch (error) {

    const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

    alert(message);

}finally{

            setLoading(false);

        }

    }

    if(loading){

        return(

            <div className="flex justify-center mt-24">

                <Loader/>

            </div>

        );
        if (!dashboard) {
    return (
        <div className="flex items-center justify-center h-96">
            <p className="text-red-500 text-lg">
                Unable to load dashboard.
            </p>
        </div>
    );
}

    }
return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Welcome */}
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold break-words">
                Welcome back,{" "}
                <span>{dashboard.profile.name}</span>
            </h1>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Ready to learn something new today?
            </p>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

            {/* Available Credits */}
            <div className="bg-white rounded-2xl border p-5 sm:p-6 shadow-sm min-w-0">

                <div className="flex items-center justify-between gap-4">

                    <div className="min-w-0">

                        <p className="text-sm text-slate-500">
                            Available Credits
                        </p>

                        <p className="text-2xl sm:text-3xl font-bold mt-2">
                            {(dashboard.wallet.credits || 0) -
                                (dashboard.wallet.reservedCredits || 0)}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-500 mt-2">
                            {dashboard.wallet.reservedCredits || 0}
                            {" "}credits reserved
                        </p>

                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl shrink-0">
                        <Wallet
                            size={24}
                            className="text-emerald-600"
                        />
                    </div>

                </div>

            </div>


            <StatCard
                title="Teaching Skills"
                value={dashboard.skills.teaching}
                icon={<BookOpen size={24} />}
            />


            <StatCard
                title="Learning Skills"
                value={dashboard.skills.learning}
                icon={<GraduationCap size={24} />}
            />


            <StatCard
                title="Upcoming Sessions"
                value={dashboard.sessions.upcoming}
                icon={<Calendar size={24} />}
            />

        </div>


        {/* Requests + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

            {/* Requests */}
            <Card className="min-w-0">

                <h2 className="text-lg sm:text-xl font-semibold">
                    Requests
                </h2>

                <div className="mt-5 sm:mt-6 space-y-4">

                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm sm:text-base">
                            Pending
                        </span>

                        <strong>
                            {dashboard.requests.pending}
                        </strong>
                    </div>


                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm sm:text-base">
                            Accepted
                        </span>

                        <strong>
                            {dashboard.requests.accepted}
                        </strong>
                    </div>


                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm sm:text-base">
                            Completed
                        </span>

                        <strong>
                            {dashboard.requests.completed}
                        </strong>
                    </div>

                </div>

            </Card>


            {/* Quick Actions */}
            <Card className="min-w-0">

                <h2 className="text-lg sm:text-xl font-semibold">
                    Quick Actions
                </h2>

                <div className="mt-5 sm:mt-6 flex flex-col gap-3">

                    <Link
                        to="/explore"
                        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 text-center transition"
                    >
                        Explore Skills
                    </Link>

                    <Link
                        to="/profile"
                        className="w-full rounded-lg border py-3 px-4 text-center hover:bg-slate-50 transition"
                    >
                        Complete Profile
                    </Link>

                </div>

            </Card>

        </div>

    </div>
);

}