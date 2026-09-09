import { useEffect, useState } from "react";
import {
    Wallet as WalletIcon,
    ArrowUpRight,
    ArrowDownLeft,
    Lock,
} from "lucide-react";

import walletAPI from "../../api/wallet.api";
import Loader from "../../components/ui/Loader";


export default function Wallet() {

    const [wallet, setWallet] =
        useState(null);

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        loadWallet();

    }, []);


    async function loadWallet() {

        try {

            setLoading(true);

            const response =
                await walletAPI.getWallet();

            setWallet(
                response.wallet
            );

            setTransactions(
                response.transactions || []
            );

        } catch (error) {

            console.error(
                "Failed to load wallet:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load wallet."
            );

        } finally {

            setLoading(false);

        }

    }


    function formatDate(date) {

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            );

    }


    function formatTime(date) {

        return new Date(date)
            .toLocaleTimeString(
                "en-IN",
                {
                    hour: "numeric",
                    minute: "2-digit",
                }
            );

    }


    if (loading) {

        return (
            <Loader />
        );

    }


    if (!wallet) {

        return (
            <div className="p-8">
                Unable to load wallet.
            </div>
        );

    }


    return (

        <div className="max-w-6xl mx-auto p-6 md:p-8">

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    My Wallet
                </h1>

                <p className="text-slate-500 mt-2">
                    Manage your SkillSwap credits
                    and view your transaction history.
                </p>

            </div>


            {/* BALANCE CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">


                {/* AVAILABLE */}

                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Available Credits
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {wallet.availableCredits}
                            </p>

                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50">

                            <WalletIcon
                                size={25}
                                className="text-emerald-600"
                            />

                        </div>

                    </div>

                    <p className="text-xs text-slate-500 mt-4">
                        Credits you can currently spend
                    </p>

                </div>


                {/* RESERVED */}

                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Reserved Credits
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {wallet.reservedCredits}
                            </p>

                        </div>

                        <div className="p-3 rounded-xl bg-amber-50">

                            <Lock
                                size={25}
                                className="text-amber-600"
                            />

                        </div>

                    </div>

                    <p className="text-xs text-slate-500 mt-4">
                        Locked for active sessions
                    </p>

                </div>


                {/* TOTAL */}

                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Credits
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {wallet.totalCredits}
                            </p>

                        </div>

                        <div className="p-3 rounded-xl bg-blue-50">

                            <WalletIcon
                                size={25}
                                className="text-blue-600"
                            />

                        </div>

                    </div>

                    <p className="text-xs text-slate-500 mt-4">
                        Your complete credit balance
                    </p>

                </div>

            </div>


            {/* TRANSACTIONS */}

            <div className="bg-white border rounded-2xl shadow-sm">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold">
                        Transaction History
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Your credit activity
                    </p>

                </div>


                {transactions.length === 0 ? (

                    <div className="p-10 text-center">

                        <WalletIcon
                            size={40}
                            className="mx-auto text-slate-300 mb-3"
                        />

                        <p className="font-medium">
                            No transactions yet
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            Your credit activity will appear here.
                        </p>

                    </div>

                ) : (

                    <div>

                        {transactions.map(
                            (transaction) => {

                                const positive =
                                    transaction.amount > 0;


                                return (

                                    <div
                                        key={
                                            transaction._id
                                        }
                                        className="flex items-center justify-between gap-4 p-5 border-b last:border-b-0"
                                    >

                                        <div className="flex items-center gap-4 min-w-0">

                                            <div
                                                className={`p-2 rounded-full ${
                                                    positive
                                                        ? "bg-emerald-50"
                                                        : "bg-red-50"
                                                }`}
                                            >

                                                {positive ? (

                                                    <ArrowDownLeft
                                                        size={20}
                                                        className="text-emerald-600"
                                                    />

                                                ) : (

                                                    <ArrowUpRight
                                                        size={20}
                                                        className="text-red-600"
                                                    />

                                                )}

                                            </div>


                                            <div className="min-w-0">

                                                <p className="font-medium truncate">
                                                    {
                                                        transaction.reason
                                                    }
                                                </p>

                                                <p className="text-xs text-slate-500 mt-1">
                                                    {
                                                        formatDate(
                                                            transaction.createdAt
                                                        )
                                                    }
                                                    {" · "}
                                                    {
                                                        formatTime(
                                                            transaction.createdAt
                                                        )
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        <div className="text-right shrink-0">

                                            <p
                                                className={`font-bold ${
                                                    positive
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {positive
                                                    ? "+"
                                                    : ""}
                                                {
                                                    transaction.amount
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Balance:{" "}
                                                {
                                                    transaction.balanceAfter
                                                }
                                            </p>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );
}