"use client";

import { Search, Bell } from "lucide-react";
import Image from "next/image";

export function TeacherHeader() {
    return (
        <header className="h-[70px] w-full bg-white border-b border-[#f0f0f0] flex items-center justify-between px-6 md:px-8 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="relative w-[400px]">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search Papers, Teachers & Visits"
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Notification */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                </button>

                {/* Profile */}
                <div className="h-10 w-10 rounded-full border border-gray-200 overflow-hidden cursor-pointer">
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
