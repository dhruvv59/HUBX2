
import React, { Suspense } from "react";
import { getTeacherDashboardData } from "@/services/teacher-dashboard";
import { StatCard, StatCardSkeleton } from "@/components/teacher/dashboard/StatCard";
import { Banners } from "@/components/teacher/dashboard/Banners";
import { RevenueChart, RevenueChartSkeleton } from "@/components/teacher/dashboard/RevenueChart";
import { LikeabilityChart, LikeabilityChartSkeleton } from "@/components/teacher/dashboard/LikeabilityChart";
import { NotificationsList, NotificationsListSkeleton } from "@/components/teacher/dashboard/NotificationsList";

async function DashboardContent() {
    const data = await getTeacherDashboardData();

    return (
        <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Hello, {data.teacherName}</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {data.stats.map(stat => (
                    <StatCard key={stat.id} stat={stat} />
                ))}
            </div>

            {/* Banners */}
            <Banners />

            {/* Bottom Grid: Charts & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-5">
                    <RevenueChart data={data.revenueData} />
                    <LikeabilityChart data={data.likeabilityData} />
                </div>

                {/* Right Column: Notifications */}
                <div className="lg:col-span-1">
                    <NotificationsList notifications={data.notifications} />
                </div>
            </div>
        </div>
    );
}

export default function TeacherDashboard() {
    return (
        <Suspense fallback={<DashboardLoading />}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardLoading() {
    return (
        <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
            {/* Header */}
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
            </div>

            {/* Banners Placeholder */}
            <div className="h-[110px] bg-gray-100 rounded-2xl animate-pulse"></div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">
                    <RevenueChartSkeleton />
                    <LikeabilityChartSkeleton />
                </div>
                <div className="lg:col-span-1">
                    <NotificationsListSkeleton />
                </div>
            </div>
        </div>
    );
}
