"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Compass,        // Dashboard
    ClipboardCheck, // Assessment
    Files,          // Papers
    HelpCircle,     // Help
    Sparkles,       // AI
    MapPin,         // Excursion (looks like a map pin/compass)
    Rocket
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/teacher/dashboard", icon: Compass },
    { name: "Assessments", href: "/teacher/assessments", icon: ClipboardCheck },
    { name: "Papers", href: "/teacher/papers", icon: Files },
    { name: "Help", href: "/teacher/help", icon: HelpCircle },
    { name: "AI Features", href: "/teacher/ai", icon: Sparkles },
    { name: "Excursion", href: "/teacher/excursion", icon: MapPin },
];

export function TeacherSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex h-full w-[100px] flex-col bg-white border-r border-[#f3f4f6] items-center py-8 z-50 fixed left-0 top-0 bottom-0 shadow-[0_0_15px_rgba(0,0,0,0.02)]">
            {/* Logo */}
            <div className="mb-10">
                <Image
                    src="/assets/images/logo-icon.png"
                    alt="Hubx"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                />
            </div>

            {/* Navigation */}
            <div className="flex-1 w-full space-y-6 flex flex-col items-center">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative group flex items-center justify-center h-10 w-full cursor-pointer"
                        >
                            {/* Active Indicator (Right Border) */}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[4px] bg-[#4f46e5] rounded-l-md" />
                            )}

                            {/* Icon */}
                            <item.icon
                                className={cn(
                                    "h-7 w-7 transition-all duration-200",
                                    isActive
                                        ? "text-[#4f46e5]"
                                        : "text-gray-400 group-hover:text-[#4f46e5]"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Action - Rocket Gradient Button */}
            <div className="mt-auto mb-6">
                <button className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 text-white hover:scale-105 transition-transform">
                    <Rocket className="h-6 w-6 fill-white" />
                </button>
            </div>
        </div>
    );
}
