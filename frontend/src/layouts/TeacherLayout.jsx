import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes";
import { Home, BookOpen, Users, LogOut, Smile, Paperclip, Menu, X, User } from "lucide-react";

export default function TeacherLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { icon: Home, label: "Dashboard", href: paths.teacher },
        { icon: BookOpen, label: "Classes", href: paths.teacherClasses },
        { icon: Paperclip, label: "Activities", href: paths.teacherActivities },
    ];

    const handleLogout = async () => {
        await logout();
        navigate(paths.login);
    };

    return (
        <div className="flex min-h-screen bg-[#e7f0de]">

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-green-700 to-green-600
                text-white shadow-xl rounded-r-3xl transition-transform duration-300 md:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:flex md:flex-col
            `}>
                <div className="flex flex-col items-center justify-center h-28 border-b border-green-500 py-4">
                    <Smile className="h-12 w-12 text-orange-400 mb-2 animate-bounce" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white text-center tracking-wide">
                        Teacher Portal
                    </h2>
                </div>

                <nav className="flex-1 px-6 py-6 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-green-800 hover:bg-green-600 shadow-md transition-all duration-200 font-semibold text-white text-base sm:text-lg"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}

                    {/* Profile Button */}
                    <Link
                        to={paths.profile}
                        className="flex items-center gap-3 px-5 py-3 mt-4 rounded-2xl bg-yellow-500 hover:bg-yellow-400 shadow-md transition-all duration-200 font-semibold text-white text-base sm:text-lg"
                    >
                        <User className="h-5 w-5" />
                        Edit Profile
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-5 py-3 mt-4 rounded-2xl bg-red-600 hover:bg-red-500 shadow-md transition-all duration-200 font-semibold text-white text-base sm:text-lg"
                    >
                        <LogOut className="h-5 w-5" />
                        Log out
                    </button>
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Mobile Header */}
                <header className="flex items-center justify-between md:hidden bg-green-700 text-white shadow-md px-4 py-4 rounded-b-3xl">
                    <div className="flex items-center gap-2">
                        <Smile className="h-8 w-8 text-orange-400 animate-bounce" />
                        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">Teacher Portal</h1>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? (
                            <X className="h-6 w-6 text-white" />
                        ) : (
                            <Menu className="h-6 w-6 text-white" />
                        )}
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#e7f0de] rounded-t-3xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
