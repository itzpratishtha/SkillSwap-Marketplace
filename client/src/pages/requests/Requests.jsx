import { useEffect, useState } from "react";
import requestAPI from "../../api/request.api";

import RequestCard from "../../components/requests/RequestCard";
import RequestTabs from "../../components/requests/RequestTabs";
import EmptyState from "../../components/requests/EmptyState";
import Loader from "../../components/ui/Loader";

export default function Requests() {

    const [tab, setTab] = useState("sent");

    const [sentRequests, setSentRequests] = useState([]);

    const [receivedRequests, setReceivedRequests] = useState([]);

    const [loading,setLoading]=useState(true);

const currentRequests =
    tab === "sent"
        ? sentRequests
        : receivedRequests;

    useEffect(() => {
        loadRequests();
    }, []);

  async function loadRequests() {
    try {
        setLoading(true);

        const [sent, received] = await Promise.all([
            requestAPI.getSentRequests(),
            requestAPI.getReceivedRequests(),
        ]);

        setSentRequests(sent.requests);
        setReceivedRequests(received.requests);

    } catch (error) {

        alert(error.response?.data?.message || "Unable to load requests.");

    } finally {

        setLoading(false);

    }
}

    if(loading){

    return <Loader/>;

}

   return (
    <div className="w-full max-w-6xl mx-auto">

        <div className="mb-6 sm:mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold">
                My Requests
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-2">
                Manage your sent and received learning requests.
            </p>

        </div>


        <RequestTabs
            tab={tab}
            setTab={setTab}
        />


        <div className="space-y-4 sm:space-y-5">

            {currentRequests.length === 0 ? (

                <EmptyState
                    message={
                        tab === "sent"
                            ? "You haven't sent any learning requests yet."
                            : "No one has requested a session from you yet."
                    }
                />

            ) : (

                currentRequests.map((request) => (

                    <RequestCard
                        key={request._id}
                        request={request}
                        tab={tab}
                        reload={loadRequests}
                    />

                ))

            )}

        </div>

    </div>
);

}