"use client";

import { Search, Bell, Menu } from "lucide-react";
import Image from "next/image";

interface TeacherHeaderProps {
    onMenuClick?: () => void;
}

export function TeacherHeader({ onMenuClick }: TeacherHeaderProps) {
    return (
        <header className="h-[70px] w-full bg-white border-b border-[#f0f0f0] flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 gap-4">
            {/* Left Section: Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar */}
                <div className="relative w-full max-w-[400px] hidden sm:block">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Papers, Teachers & Visits"
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
                        suppressHydrationWarning={true}
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                {/* Mobile Search Icon (visible when search bar is hidden) */}
                <button className="p-2 text-gray-400 hover:text-gray-600 sm:hidden">
                    <Search className="h-5 w-5" />
                </button>

                {/* Notification */}
                <button
                    className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    suppressHydrationWarning={true}
                >
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                </button>

                {/* Profile */}
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-gray-200 overflow-hidden cursor-pointer">
                    {/* Using a placeholder avatar until we have a real one from auth */}
                    <Image
                        src="/assets/images/avatar-male-1.png"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}

