import { NavLink } from "react-router-dom";

const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore skills", path: "/explore" },
    { name: "Requests", path: "/requests" },
    { name: "Sessions", path: "/sessions" },
    { name: "Wallet", path: "/wallet" },
    { name: "Profile", path: "/profile" },
];

export default function Sidebar({
    mobileOpen = false,
    onClose = () => {},
}) {

    return (
        <>
            {/* Mobile backdrop */}

            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}


            <aside
                className={`
                    fixed md:static
                    top-16 md:top-auto
                    left-0
                    z-50 md:z-auto
                    h-[calc(100vh-64px)]
                    w-64
                    bg-white
                    border-r
                    shrink-0
                    transform
                    transition-transform
                    duration-200
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    }
                `}
            >

                <nav className="p-4 md:p-6 space-y-2">

                    {links.map((link) => (

                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `block rounded-lg px-4 py-3 transition ${
                                    isActive
                                        ? "bg-emerald-600 text-white"
                                        : "hover:bg-slate-100"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>

                    ))}

                </nav>

            </aside>
        </>
    );
}