import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import AIAssistant from "../components/ai/AIAssistant";

export default function DashboardLayout() {

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    function toggleMobileMenu() {

        setMobileMenuOpen(
            (previous) => !previous
        );

    }


    function closeMobileMenu() {

        setMobileMenuOpen(false);

    }


    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar
                onMenuClick={toggleMobileMenu}
                mobileMenuOpen={mobileMenuOpen}
            />


            <div className="flex min-h-[calc(100vh-64px)]">

                <Sidebar
                    mobileOpen={mobileMenuOpen}
                    onClose={closeMobileMenu}
                />


                <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">

                    <Outlet />

                </main>
                <AIAssistant />

            </div>

        </div>
    );
}