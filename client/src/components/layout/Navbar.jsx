import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

export default function Navbar({
    onMenuClick,
    mobileMenuOpen = false,
}) {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] =
        useState(false);


    async function handleLogout() {

        try {

            await logout();

            navigate("/login", {
                replace: true,
            });

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }


    return (

        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">

            {/* LEFT */}

            <div className="flex items-center gap-3">

                {/* Mobile menu button */}

                <button
                    type="button"
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                    aria-label="Toggle navigation"
                >

                    {mobileMenuOpen ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}

                </button>


                {/* BRAND */}

                <h1 className="text-lg sm:text-xl font-bold text-emerald-600">
                    SkillBridge
                </h1>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-2 sm:gap-4">

                <NotificationBell />


                {/* PROFILE */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen(
                                (previous) =>
                                    !previous
                            )
                        }
                        className="flex items-center gap-2 sm:gap-3 hover:bg-slate-50 rounded-lg px-1.5 sm:px-2 py-1.5 transition"
                    >

                        {/* Hide text on very small screens */}

                        <div className="hidden sm:block text-right">

                            <p className="font-semibold text-sm lg:text-base">
                                {user?.name}
                            </p>

                            <p className="text-xs lg:text-sm text-slate-500">
                                {user?.role}
                            </p>

                        </div>


                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>


                        <span className="hidden sm:inline text-slate-400">
                            ▾
                        </span>

                    </button>


                    {/* DROPDOWN */}

                    {menuOpen && (

                        <div className="absolute right-0 top-12 sm:top-14 w-48 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">

                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/profile");
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50"
                            >
                                Profile
                            </button>


                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/wallet");
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50"
                            >
                                Wallet
                            </button>


                            <div className="border-t" />


                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}