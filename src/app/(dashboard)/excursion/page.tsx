import React from "react";
import { Search, MapPin, Clock, Users, BarChart3, ChevronRight, FileText, CheckCircle2, Ticket, Wind, Cpu, Factory, Building2, Plane } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExcursionHero } from "@/components/excursion/ExcursionHero";

// Mock Data matching the screenshot
const excursions = [
    {
        id: "ola",
        company: "OLA Electric",
        industry: "Renewable Energy",
        logoBg: "bg-black",
        logoColor: "text-green-400",
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: "Max 40 Students",
        visits: "57 Visits",
        votes: "72 Votes",
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        status: "Approved",
        date: "10th Jan 2pm",
        hasConsent: false,
    },
    {
        id: "glenmark",
        company: "Glenmark",
        industry: "Biotechnology",
        logoBg: "bg-red-600",
        logoColor: "text-white",
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: "Max 40 Students",
        visits: "57 Visits",
        votes: "72 Votes",
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        status: "Pending",
        date: "22nd Feb 9am",
        hasConsent: true,
    },
    {
        id: "google",
        company: "Google",
        industry: "Software Company",
        logoBg: "bg-white",
        logoIsImage: true,
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: "Max 40 Students",
        visits: "57 Visits",
        votes: "72 Votes",
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        status: "High Demand",
        interest: 75,
    },
    {
        id: "adani",
        company: "Adani Green",
        industry: "Renewable Energy",
        logoBg: "bg-blue-600",
        logoColor: "text-white",
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: "Max 40 Students",
        visits: "57 Visits",
        votes: "72 Votes",
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        status: "Voting",
        interest: 29,
        needVotes: "Need 41% more vote",
    }
];

const SidebarFilterItem = ({ label, count, active }: { label: string, count?: number, active?: boolean }) => (
    <div className="flex items-center gap-3 py-2 cursor-pointer group">
        <div className={cn("w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center transition-colors", active && "border-indigo-600")}>
            {active && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
        </div>
        <span className={cn("text-gray-600 text-sm font-medium group-hover:text-indigo-600 transition-colors", active && "text-indigo-900")}>{label}</span>
    </div>
);

export default function ExcursionPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] p-6 font-sans">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Link href="/dashboard" className="flex items-center gap-1 hover:text-gray-600 cursor-pointer transition-colors">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                </div>
                <ExcursionHero />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Companies</h3>
                        <div className="space-y-1">
                            <SidebarFilterItem label="All" active />
                            <SidebarFilterItem label="Upcoming" />
                            <SidebarFilterItem label="Pending" />
                            <SidebarFilterItem label="Completed Trips" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Company Type</h3>
                        <div className="space-y-1">
                            <SidebarFilterItem label="All" active />
                            <SidebarFilterItem label="Software" />
                            <SidebarFilterItem label="Renewable Energy" />
                            <SidebarFilterItem label="Biotechnology" />
                            <SidebarFilterItem label="Automotive" />
                            <SidebarFilterItem label="Finance" />
                            <SidebarFilterItem label="Aerospace" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Industries, Companies or Locations"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                        />
                    </div>

                    {/* Cards */}
                    <div className="space-y-6">
                        {excursions.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">

                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        {/* Logo Placeholder */}
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold", item.logoBg, item.logoColor)}>
                                            {item.logoIsImage ? (
                                                <span className="text-2xl">G</span> // Placeholder for Google Image
                                            ) : (
                                                item.company[0]
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{item.company}</h3>
                                            <p className="text-sm text-gray-500">{item.industry}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {/* Status Badge */}
                                        {item.status === "Approved" && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-600">{item.date}</span>
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">Approved</span>
                                            </div>
                                        )}
                                        {item.status === "Pending" && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-600">{item.date}</span>
                                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Pending
                                                </span>
                                            </div>
                                        )}
                                        {item.status === "High Demand" && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-emerald-500">High Demand - Ready to Book</span>
                                            </div>
                                        )}
                                        {item.status === "Voting" && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-500">{item.needVotes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar for Voting/Interest */}
                                {(item.status === "High Demand" || item.status === "Voting") && (
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs mb-1 font-semibold">
                                            <span>Student Interest - {item.interest}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                            <div className="bg-gradient-to-r from-orange-400 to-emerald-400 h-1.5 rounded-full" style={{ width: `${item.interest}%` }}></div>
                                        </div>
                                    </div>
                                )}

                                {/* Stats Row */}
                                <div className="flex flex-wrap items-center gap-6 mb-4 text-xs font-medium text-gray-600">
                                    <div className="flex items-center gap-1"><span className="text-orange-400">★</span> {item.rating}</div>
                                    <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> {item.duration}</div>
                                    <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-400" /> {item.maxStudents}</div>
                                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {item.visits}</div>
                                    <div className="flex items-center gap-1"><BarChart3 className="w-4 h-4 text-gray-400" /> {item.votes}</div>
                                    <div className="flex items-center gap-1 ml-auto"><MapPin className="w-4 h-4 text-gray-400" /> {item.location}</div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                    {item.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-100 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <button suppressHydrationWarning className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                                        View Details
                                    </button>
                                    {item.hasConsent && (
                                        <Link href={`/excursion/${item.id}/consent`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                            View Consent Form
                                        </Link>
                                    )}
                                    {item.company === "Google" && (
                                        <button suppressHydrationWarning className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><CheckCircle2 className="w-5 h-5 text-gray-400" /></button>
                                    )}
                                    {item.company === "Adani Green" && (
                                        <button suppressHydrationWarning className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><CheckCircle2 className="w-5 h-5 text-gray-400" /></button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 pt-8">
                        <span className="text-sm text-gray-400 mr-2">Prev</span>
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                            <button suppressHydrationWarning key={num} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors", num === 1 ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100")}>
                                {num}
                            </button>
                        ))}
                        <span className="text-sm text-indigo-600 font-medium ml-2 cursor-pointer">Next</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
