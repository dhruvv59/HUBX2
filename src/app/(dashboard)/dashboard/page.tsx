"use client";

import React, { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboard";
import { getPurchasedPapersCount } from "@/services/paper";
import { DashboardData } from "@/types/dashboard";
import { StatCard } from "@/components/dashboard/StatCard";
import { PaperCard } from "@/components/dashboard/PaperCard";
import { PurchasedPapersCard } from "@/components/dashboard/PurchasedPapersCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { SubjectPerformanceWidget } from "@/components/dashboard/SubjectPerformanceWidget";
import { PeerRankWidget } from "@/components/dashboard/PeerRankWidget";
// import { FocusAreaWidget } from "@/components/dashboard/FocusAreaWidget";
import { ExcursionBanner } from "@/components/dashboard/ExcursionBanner";
import { AIAssessmentBanner } from "@/components/dashboard/AIAssessmentBanner";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
// import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";

// import { DailyQuestionWidget } from "@/components/dashboard/DailyQuestionWidget";
import { UpcomingExamsWidget } from "@/components/dashboard/UpcomingExamsWidget";
import { CombinedWidget } from "@/components/dashboard/CombinedWidget";
import { HubXSmartTestsWidget } from "@/components/dashboard/HubXSmartTestsWidget";
import { SyllabusCoverageWidget } from "@/components/dashboard/SyllabusCoverageWidget";








export default function StudentDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [purchasedPapersCount, setPurchasedPapersCount] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const [dashboardData, purchasedCount] = await Promise.all([
                    getDashboardData(),
                    getPurchasedPapersCount()
                ]);
                setData(dashboardData);
                setPurchasedPapersCount(purchasedCount);
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
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 font-sans bg-[#fafafa] min-h-screen">
            {/* Greeting */}
            <div>
                <h1 className="text-[24px] md:text-[28px] font-bold text-[#111827] tracking-tight">Hello, {data.user.name}</h1>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT COLUMN (Main Content) */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                    {/* Top Statistics Cards - 2 columns on mobile */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                        {data.stats.map(stat => (
                            <StatCard key={stat.id} data={stat} />
                        ))}
                    </div>

                    {/* Excursion Banner */}
                    <ExcursionBanner data={data.latestExcursion} />

                    {/* Papers & AI Assessment Cards - Mobile Only (Above Performance Chart) */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                        {data.papers.map(paper => (
                            <PaperCard key={paper.id} data={paper} />
                        ))}

                        {/* Purchased Papers Card - Only show if student has purchased papers */}
                        {purchasedPapersCount > 0 && (
                            <PurchasedPapersCard count={purchasedPapersCount} />
                        )}

                        {/* AI Assessment Banner */}
                        <AIAssessmentBanner />
                    </div>

                    {/* Performance Analysis Chart */}
                    <PerformanceChart initialData={data.performanceData} />

                    {/* Bottom Charts Row - Show before papers on mobile */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 order-1 lg:order-none">
                        {/* Donut Chart Widget */}
                        <SubjectPerformanceWidget data={data.subjectPerformance} />

                        {/* Rank Line Chart Widget */}
                        <PeerRankWidget data={data.peerRank} />
                    </div>

                    {/* Syllabus Tracking Row */}
                    <div className="w-full order-3 lg:order-none">
                        <SyllabusCoverageWidget data={data.syllabus} />
                    </div>

                    {/* New HubX Smart Tests Section */}
                    <div className="order-4 lg:order-none">
                        <HubXSmartTestsWidget tests={data.testRecommendations} />
                    </div>

                </div>



                {/* RIGHT COLUMN (Widgets) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">

                    {/* Papers & AI Assessment Cards - Desktop Only (Sidebar) */}
                    <div className="hidden lg:grid lg:grid-cols-1 gap-5">
                        {data.papers.map(paper => (
                            <PaperCard key={paper.id} data={paper} />
                        ))}

                        {/* Purchased Papers Card - Only show if student has purchased papers */}
                        {purchasedPapersCount > 0 && (
                            <PurchasedPapersCard count={purchasedPapersCount} />
                        )}

                        {/* AI Assessment Banner */}
                        <AIAssessmentBanner />
                    </div>

                    {/* Upcoming Exams - New Widget to fill space */}
                    <div className="h-auto">
                        <UpcomingExamsWidget exams={data.upcomingExams} />
                    </div>

                    {/* Daily Question - New Engagement Widget */}
                    {/* <div className="h-auto">
                        <DailyQuestionWidget data={data.dailyQuestion} />
                    </div> */}


                    {/* Recent Activity / History */}
                    <RecentActivityWidget activities={data.recentActivities} />

                    {/* Notifications & AI Focus Area Combined Widget */}
                    <CombinedWidget notifications={data.notifications} focusAreas={data.focusAreas} />
                </div>


            </div>
        </div>
    );
}
