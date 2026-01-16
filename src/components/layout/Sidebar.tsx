"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Compass,
    ClipboardCheck,
    Copy,
    Sparkles,
    MapPin,
    RotateCw
} from "lucide-react";



// Matches the visual icons from the image
const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Compass }, // Blue compass-like
    { name: "Smart AI Assessment", href: "/assessments", icon: ClipboardCheck, badge: 3 }, // Custom Icon
    { name: "Public Paper", href: "/papers", icon: Copy, badge: 2 }, // Documents
    { name: "AI Features", href: "/ai-features", icon: Sparkles }, // Wand
    { name: "Excursion", href: "/excursion", icon: RotateCw }, // Compass-like
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex h-full w-[100px] flex-col bg-white border-r border-[#f3f4f6] items-center py-8 z-50 fixed left-0 top-0 bottom-0">
            {/* Logo */}
            <div className="mb-10">
                <Image
                    src="/assets/images/logo-icon.png"
                    alt="Lernen Hub"
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain"
                    priority
                />
            </div>

            {/* Navigation */}
            <div className="flex-1 w-full space-y-8 flex flex-col items-center">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);

                    // Special styling for the active Dashboard icon to look like the blue circle compass in the image
                    const isDashboard = item.name === "Dashboard";

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative group flex items-center justify-center h-10 w-full transition-all cursor-pointer",
                            )}
                        >
                            {/* Active Indicator (Right Border/Pill) */}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[4px] bg-[#6366f1] rounded-l-md" />
                            )}

                            {/* Icon Container */}
                            <div className="relative">
                                {/* If active dashboard, maybe fill it? The image has a filled blue look. Let's just use color text for now. */}
                                <item.icon
                                    className={cn(
                                        "h-7 w-7 transition-colors",
                                        isActive ? "text-[#6366f1] fill-current/10" : "text-[#9ca3af] group-hover:text-[#6366f1]"
                                    )}
                                    {...({ strokeWidth: isActive ? 2.5 : 2 })}
                                />

                                {/* Notification Badge */}
                                {item.badge && (
                                    <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-[#ff5757] rounded-full flex items-center justify-center border-[2px] border-white shadow-sm">
                                        <span className="text-[9px] font-bold text-white leading-none">{item.badge}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Actions - The image shows a compass icon at the bottom */}
            <div className="mt-auto mb-4 flex flex-col items-center">
                <button className="text-[#9ca3af] hover:text-[#6366f1] transition-colors p-2 rounded-lg">
                    <MapPin className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
