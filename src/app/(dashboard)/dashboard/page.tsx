
import React, { Suspense } from "react";
import {
    getStudentProfile,
    getDashboardStats,
    getExcursionData,
    getPapersList,
    getPerformanceMetrics,
    getSubjectPerformance,
    getPeerRank,
    getSyllabusData,
    getHubXTestRecommendations,
    getRecentActivities,
    getNotificationData,
    getUpcomingExamsList
} from "@/services/dashboard";
import { getPurchasedPapersCount } from "@/services/paper";
import { StatCard } from "@/components/dashboard/StatCard";
import { PaperCard } from "@/components/dashboard/PaperCard";
import { PurchasedPapersCard } from "@/components/dashboard/PurchasedPapersCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { SubjectPerformanceWidget } from "@/components/dashboard/SubjectPerformanceWidget";
import { PeerRankWidget } from "@/components/dashboard/PeerRankWidget";
import { ExcursionBanner } from "@/components/dashboard/ExcursionBanner";
import { AIAssessmentBanner } from "@/components/dashboard/AIAssessmentBanner";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { UpcomingExamsWidget } from "@/components/dashboard/UpcomingExamsWidget";
import { CombinedWidget } from "@/components/dashboard/CombinedWidget";
import { HubXSmartTestsWidget } from "@/components/dashboard/HubXSmartTestsWidget";
import { SyllabusCoverageWidget } from "@/components/dashboard/SyllabusCoverageWidget";
import { ErrorBoundary, ErrorFallback } from "@/components/common/ErrorBoundary";

/**
 * ASYNC STREAMING COMPONENTS
 * Each component fetches its own data independently
 */

async function HeaderSection() {
    const profile = await getStudentProfile();
    return (
        <div>
            <h1 className="text-[24px] md:text-[28px] font-bold text-[#111827] tracking-tight">
                Hello, {profile.name}
            </h1>
        </div>
    );
}

async function StatsSection() {
    const stats = await getDashboardStats();
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {stats.map(stat => (
                <StatCard key={stat.id} data={stat} />
            ))}
        </div>
    );
}

async function ExcursionSection() {
    const data = await getExcursionData();
    if (!data) return null;
    return <ExcursionBanner data={data} />;
}

async function PapersSection({ isMobile }: { isMobile?: boolean }) {
    const [papers, purchasedCount] = await Promise.all([
        getPapersList(),
        getPurchasedPapersCount()
    ]);

    // Ensure papers is an array (handle potential API issues gracefully)
    const papersList = Array.isArray(papers) ? papers : [];

    return (
        <div className={isMobile ? "grid grid-cols-2 gap-3 lg:hidden" : "hidden lg:grid lg:grid-cols-1 gap-5"}>
            {papersList.map(paper => (
                <PaperCard key={paper.id} data={paper} />
            ))}

            {purchasedCount > 0 && (
                <PurchasedPapersCard count={purchasedCount} />
            )}

            <AIAssessmentBanner />
        </div>
    );
}

async function PerformanceChartSection() {
    const data = await getPerformanceMetrics();
    // Ensure data is valid for chart
    const chartData = Array.isArray(data) ? data : [];
    return <PerformanceChart initialData={chartData} />;
}

async function BottomChartsSection() {
    // Determine layout order for mobile vs desktop
    // Tailwind classes handle order: "order-1 lg:order-none"
    const [subjectPerf, peerRank] = await Promise.all([
        getSubjectPerformance(),
        getPeerRank()
    ]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 order-1 lg:order-none">
            <SubjectPerformanceWidget data={subjectPerf} />
            <PeerRankWidget data={peerRank} />
        </div>
    );
}

async function SyllabusSection() {
    const syllabus = await getSyllabusData();
    const syllabusList = Array.isArray(syllabus) ? syllabus : [];
    return (
        <div className="w-full order-3 lg:order-none">
            <SyllabusCoverageWidget data={syllabusList} />
        </div>
    );
}

async function TestRecommendationsSection() {
    const tests = await getHubXTestRecommendations();
    const testList = Array.isArray(tests) ? tests : [];
    return (
        <div className="order-4 lg:order-none">
            <HubXSmartTestsWidget tests={testList} />
        </div>
    );
}

async function SidebarWidgets() {
    const [upcomingExams, recentActivities, { notifications, focusAreas }] = await Promise.all([
        getUpcomingExamsList(),
        getRecentActivities(),
        getNotificationData()
    ]);

    return (
        <>
            <div className="h-auto">
                <UpcomingExamsWidget exams={Array.isArray(upcomingExams) ? upcomingExams : []} />
            </div>

            <RecentActivityWidget activities={Array.isArray(recentActivities) ? recentActivities : []} />

            <CombinedWidget
                notifications={Array.isArray(notifications) ? notifications : []}
                focusAreas={Array.isArray(focusAreas) ? focusAreas : []}
            />
        </>
    );
}

/**
 * LOADING SKELETONS
 */
function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-[180px] bg-gray-200 rounded-[24px]"></div>)}
        </div>
    );
}

function ChartSkeleton() {
    return <div className="h-[300px] bg-gray-200 rounded-[24px] animate-pulse"></div>;
}

function SidebarSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="h-[100px] bg-gray-200 rounded-[24px]"></div>
            <div className="h-[150px] bg-gray-200 rounded-[24px]"></div>
            <div className="h-[200px] bg-gray-200 rounded-[24px]"></div>
        </div>
    );
}

/**
 * SERVER COMPONENT PAGE
 */
export default function StudentDashboard() {
    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 font-sans bg-[#fafafa] min-h-screen">
            {/* Greeting - High Priority */}
            <ErrorBoundary>
                <Suspense fallback={<div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>}>
                    <HeaderSection />
                </Suspense>
            </ErrorBoundary>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT COLUMN (Main Content) */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

                    {/* Stats - High Priority */}
                    <ErrorBoundary fallback={<ErrorFallback message="Failed to load stats" />}>
                        <Suspense fallback={<StatsSkeleton />}>
                            <StatsSection />
                        </Suspense>
                    </ErrorBoundary>

                    {/* Excursion Banner */}
                    <ErrorBoundary>
                        <Suspense fallback={<div className="h-[100px] bg-gray-200 rounded-[24px] animate-pulse"></div>}>
                            <ExcursionSection />
                        </Suspense>
                    </ErrorBoundary>

                    {/* Mobile Papers Grid */}
                    <ErrorBoundary>
                        <Suspense>
                            <PapersSection isMobile={true} />
                        </Suspense>
                    </ErrorBoundary>

                    {/* Performance Chart */}
                    <ErrorBoundary fallback={<ErrorFallback message="Chart unavailable" />}>
                        <Suspense fallback={<ChartSkeleton />}>
                            <PerformanceChartSection />
                        </Suspense>
                    </ErrorBoundary>

                    {/* Bottom Charts */}
                    <ErrorBoundary fallback={<ErrorFallback message="Data unavailable" />}>
                        <Suspense fallback={<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[200px] bg-gray-100 rounded-[24px]"></div>}>
                            <BottomChartsSection />
                        </Suspense>
                    </ErrorBoundary>

                    {/* Syllabus */}
                    <ErrorBoundary>
                        <Suspense fallback={<div className="h-[150px] bg-gray-200 rounded-[24px] animate-pulse"></div>}>
                            <SyllabusSection />
                        </Suspense>
                    </ErrorBoundary>

                    {/* Test Recommendations */}
                    <ErrorBoundary>
                        <Suspense fallback={<div className="h-[150px] bg-gray-200 rounded-[24px] animate-pulse"></div>}>
                            <TestRecommendationsSection />
                        </Suspense>
                    </ErrorBoundary>

                </div>

                {/* RIGHT COLUMN (Widgets) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">

                    {/* Desktop Papers Sidebar */}
                    <ErrorBoundary>
                        <Suspense fallback={<SidebarSkeleton />}>
                            <PapersSection isMobile={false} />
                            <SidebarWidgets />
                        </Suspense>
                    </ErrorBoundary>

                </div>
            </div>
        </div>
    );
}

