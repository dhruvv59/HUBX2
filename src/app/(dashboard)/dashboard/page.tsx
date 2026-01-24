"use client";

import React, { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboard";
import { DashboardData } from "@/types/dashboard";
import { StatCard } from "@/components/dashboard/StatCard";
import { PaperCard } from "@/components/dashboard/PaperCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { SubjectPerformanceWidget } from "@/components/dashboard/SubjectPerformanceWidget";
import { PeerRankWidget } from "@/components/dashboard/PeerRankWidget";
import { NotificationWidget } from "@/components/dashboard/NotificationWidget";
import { FocusAreaWidget } from "@/components/dashboard/FocusAreaWidget";
import { ExcursionBanner } from "@/components/dashboard/ExcursionBanner";
import { AIAssessmentBanner } from "@/components/dashboard/AIAssessmentBanner";

export default function StudentDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-9 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="h-[180px] bg-gray-200 rounded-[24px]"></div>
                            <div className="h-[180px] bg-gray-200 rounded-[24px]"></div>
                            <div className="h-[180px] bg-gray-200 rounded-[24px]"></div>
                        </div>
                        <div className="h-[100px] bg-gray-200 rounded-[24px]"></div>
                        <div className="h-[300px] bg-gray-200 rounded-[24px]"></div>
                    </div>
                    <div className="col-span-12 lg:col-span-3 space-y-5">
                        <div className="h-[100px] bg-gray-200 rounded-[24px]"></div>
                        <div className="h-[100px] bg-gray-200 rounded-[24px]"></div>
                        <div className="h-[100px] bg-gray-200 rounded-[24px]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-500 mb-4">{error || "No data available"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 font-sans bg-[#fafafa] min-h-screen">
            {/* Greeting */}
            <div>
                <h1 className="text-[24px] md:text-[28px] font-bold text-[#111827] tracking-tight">Hello, {data.user.name}</h1>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT COLUMN (Main Content) */}
                <div className="col-span-12 lg:col-span-9 space-y-5">

                    {/* Top Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {data.stats.map(stat => (
                            <StatCard key={stat.id} data={stat} />
                        ))}
                    </div>

                    {/* Excursion Banner */}
                    <ExcursionBanner data={data.latestExcursion} />

                    {/* Performance Analysis Chart */}
                    <PerformanceChart initialData={data.performanceData} />

                    {/* Bottom Charts Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Donut Chart Widget */}
                        <SubjectPerformanceWidget data={data.subjectPerformance} />

                        {/* Rank Line Chart Widget */}
                        <PeerRankWidget data={data.peerRank} />
                    </div>

                </div>

                {/* RIGHT COLUMN (Widgets) */}
                <div className="col-span-12 lg:col-span-3 space-y-5">

                    {/* Papers & AI Assessment Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                        {data.papers.map(paper => (
                            <PaperCard key={paper.id} data={paper} />
                        ))}

                        {/* AI Assessment Banner */}
                        <AIAssessmentBanner />
                    </div>

                    {/* Notifications Widget */}
                    <NotificationWidget notifications={data.notifications} />

                    {/* AI Focus Area Widget */}
                    <FocusAreaWidget focusAreas={data.focusAreas} />
                </div>
            </div>
        </div>
    );
}
