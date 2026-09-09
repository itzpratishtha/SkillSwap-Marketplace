import { useEffect, useState } from "react";

import sessionAPI from "../../api/session.api";

import Loader from "../../components/ui/Loader";

import SessionTabs from "../../components/sessions/SessionTabs";
import SessionCard from "../../components/sessions/SessionCard";
import EmptySessions from "../../components/sessions/EmptySessions";

export default function Sessions() {

    const [loading, setLoading] = useState(true);

    const [tab, setTab] = useState("learning");

    const [learningSessions, setLearningSessions] = useState([]);

    const [teachingSessions, setTeachingSessions] = useState([]);

    useEffect(() => {

        loadSessions();

    }, []);

    async function loadSessions() {

        try {

            setLoading(true);

            const [learning, teaching] = await Promise.all([

                sessionAPI.getLearningSessions(),

                sessionAPI.getTeachingSessions()

            ]);

            setLearningSessions(learning.sessions);

            setTeachingSessions(teaching.sessions);

        }

        catch(error){

            alert(

                error.response?.data?.message ||

                "Unable to load sessions."

            );

        }

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return <Loader/>;

    }

    const currentSessions =

        tab==="learning"

        ?

        learningSessions

        :

        teachingSessions;

    return (

        <div className="w-full max-w-6xl mx-auto">

            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">

                My Sessions

            </h1>

            <SessionTabs

                tab={tab}

                setTab={setTab}

            />

            {

                currentSessions.length===0

                ?

                <EmptySessions

                    tab={tab}

                />

                :

                <div className="space-y-6">

                    {

                        currentSessions.map(session=>(

                            <SessionCard

                                key={session._id}

                                session={session}

                                tab={tab}

                                reload={loadSessions}

                            />

                        ))

                    }

                </div>

            }

        </div>

    );

}