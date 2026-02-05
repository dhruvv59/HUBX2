
import React, { Suspense } from "react";
import {
    getTeacherInfo,
    getTeacherStats,
    getRevenueData,
    getLikeabilityData,
    getNotifications
} from "@/services/teacher-dashboard";
import { StatCard, StatCardSkeleton } from "@/components/teacher/dashboard/StatCard";
import { Banners } from "@/components/teacher/dashboard/Banners";
import { RevenueChart, RevenueChartSkeleton } from "@/components/teacher/dashboard/RevenueChart";
import { LikeabilityChart, LikeabilityChartSkeleton } from "@/components/teacher/dashboard/LikeabilityChart";
import { NotificationsList, NotificationsListSkeleton } from "@/components/teacher/dashboard/NotificationsList";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

/**
 * STREAMING COMPONENTS
 * Each component loads independently for better UX
 */

async function TeacherHeader() {
    const info = await getTeacherInfo();
    return <h1 className="text-2xl font-bold text-gray-800">Hello, {info.teacherName}</h1>;
}

async function StatsGrid() {
    const stats = await getTeacherStats();
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map(stat => (
                <StatCard key={stat.id} stat={stat} />
            ))}
        </div>
    );
}

async function RevenueSection() {
    const data = await getRevenueData();
    return <RevenueChart data={data} />;
}

async function LikeabilitySection() {
    const data = await getLikeabilityData();
    return <LikeabilityChart data={data} />;
}

async function NotificationsSection() {
    const notifications = await getNotifications();
    return <NotificationsList notifications={notifications} />;
}

/**
 * Main Dashboard Page
 * Uses Suspense boundaries for progressive loading
 * Uses Error boundaries for fault isolation
 */
export default function TeacherDashboard() {
    return (
        <div className="space-y-6 max-w-[1500px] mx-auto pb-10 px-4 sm:px-6">
            {/* Header - Loads first (fastest) */}
            <ErrorBoundary>
                <Suspense fallback={<div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>}>
                    <TeacherHeader />
                </Suspense>
            </ErrorBoundary>

            {/* Stats Grid - Loads second */}
            <ErrorBoundary>
                <Suspense fallback={
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
                    </div>
                }>
                    <StatsGrid />
                </Suspense>
            </ErrorBoundary>

            {/* Banners - Static content, no loading needed */}
            <Banners />

            {/* Bottom Grid: Charts & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Revenue Chart */}
                    <ErrorBoundary>
                        <Suspense fallback={<RevenueChartSkeleton />}>
                            <RevenueSection />
                        </Suspense>
                    </ErrorBoundary>

                    {/* Likeability Chart */}
                    <ErrorBoundary>
                        <Suspense fallback={<LikeabilityChartSkeleton />}>
                            <LikeabilitySection />
                        </Suspense>
                    </ErrorBoundary>
                </div>

                {/* Right Column: Notifications */}
                <div className="lg:col-span-1">
                    <ErrorBoundary>
                        <Suspense fallback={<NotificationsListSkeleton />}>
                            <NotificationsSection />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}
