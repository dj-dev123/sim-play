import { Link, usePage } from "@inertiajs/react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#e7f0de] flex flex-col">

            {/* Top Header */}
            <header className="bg-green-700 text-white px-6 py-4 shadow-md rounded-b-3xl flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
                    Student Portal
                </h1>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-full hover:bg-green-600 transition"
                    >
                        <User className="h-5 w-5" />
                        <span className="hidden sm:block font-semibold">
                            {auth.user.firstname}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-green-100 transition"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </Link>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-100 transition"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}
