
import { TeacherDashboardData } from "@/types/teacher";

/**
 * Teacher Dashboard Data Service
 * 
 * TODO: Backend API Integration Required
 * =====================================
 * 
 * This service currently returns mock data for development/testing purposes.
 * When the backend API is ready, replace this mock implementation with actual API calls.
 * 
 * Expected API Endpoints:
 * -----------------------
 * 1. GET /api/teacher/dashboard
 *    - Returns: Complete dashboard data (stats, charts, notifications)
 *    - Auth: Required (Bearer token)
 * 
 * 2. GET /api/teacher/dashboard/revenue?period={period}&from={date}&to={date}
 *    - Params: period ('1month'|'3months'|'6months'|'custom'), from (ISO date), to (ISO date)
 *    - Returns: { data: ChartDataPoint[] }
 *    - Auth: Required
 * 
 * 3. GET /api/teacher/dashboard/likeability?period={period}&from={date}&to={date}
 *    - Params: period, from, to (same as revenue endpoint)
 *    - Returns: { data: ChartDataPoint[] }
 *    - Auth: Required
 * 
 * Expected Response Format:
 * ------------------------
 * {
 *   success: boolean,
 *   data: TeacherDashboardData | ChartDataPoint[],
 *   error?: string
 * }
 * 
 * Error Handling:
 * ---------------
 * - Network errors: Timeout, connection refused, etc.
 * - Auth errors: 401 Unauthorized, 403 Forbidden
 * - Validation errors: 400 Bad Request with error details
 * - Server errors: 500 Internal Server Error
 */

/**
 * STREAMING API FUNCTIONS
 * =========================
 * These functions allow progressive data loading for better UX.
 * Each section loads independently, preventing slow endpoints from blocking faster ones.
 */

/**
 * Fetch teacher name and basic info (fastest, loads first)
 */
export async function getTeacherInfo(): Promise<{ teacherName: string }> {
    // TODO: Replace with GET /api/teacher/profile
    await new Promise(resolve => setTimeout(resolve, 200));
    return { teacherName: "Mrunal Mishra" };
}

/**
 * Fetch dashboard statistics
 */
export async function getTeacherStats(): Promise<TeacherDashboardData['stats']> {
    // TODO: Replace with GET /api/teacher/dashboard/stats
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
        {
            id: "earnings",
            title: "TOTAL EARNINGS",
            value: "₹11.3k",
            subValue: "+300",
            lastMonthValue: "₹11k",
            trend: "up",
            theme: "green"
        },
        {
            id: "purchased",
            title: "TOTAL PURCHASED PAPERS",
            value: "141",
            subValue: "+ 14",
            lastMonthValue: "137",
            trend: "up",
            theme: "orange"
        },
        {
            id: "created",
            title: "PAPERS CREATED",
            value: "11",
            subValue: "+1",
            lastMonthValue: "10",
            trend: "up",
            theme: "purple"
        },
        {
            id: "trending",
            title: "TRENDING PAPERS",
            value: "03",
            subValue: "+1",
            lastMonthValue: "2",
            trend: "up",
            theme: "yellow"
        }
    ];
}

/**
 * Fetch revenue chart data
 */
export async function getRevenueData(): Promise<TeacherDashboardData['revenueData']> {
    // TODO: Replace with GET /api/teacher/dashboard/revenue
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
        { name: "Jan", value: 8000 },
        { name: "Feb", value: 3200 },
        { name: "Mar", value: 5000 },
        { name: "Apr", value: 10000 },
        { name: "May", value: 7000 },
        { name: "Jun", value: 8500 },
        { name: "Jul", value: 6500 },
        { name: "Aug", value: 7200 },
        { name: "Sep", value: 7200 },
        { name: "Oct", value: 6000 },
        { name: "Nov", value: 7200 },
        { name: "Dec", value: 11000 },
    ];
}

/**
 * Fetch likeability chart data
 */
export async function getLikeabilityData(): Promise<TeacherDashboardData['likeabilityData']> {
    // TODO: Replace with GET /api/teacher/dashboard/likeability
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { name: "Jan", value: 15 },
        { name: "Feb", value: 45 },
        { name: "Mar", value: 48 },
        { name: "Apr", value: 75 },
        { name: "May", value: 95 },
        { name: "Jun", value: 50 },
        { name: "Jul", value: 40 },
        { name: "Aug", value: 60 },
        { name: "Sep", value: 85 },
        { name: "Oct", value: 78 },
        { name: "Nov", value: 65 },
        { name: "Dec", value: 60 },
    ];
}

/**
 * Fetch notifications
 */
export async function getNotifications(): Promise<TeacherDashboardData['notifications']> {
    // TODO: Replace with GET /api/teacher/dashboard/notifications
    await new Promise(resolve => setTimeout(resolve, 700));
    return [
        {
            id: 1,
            user: "Bhagabati Das",
            action: "assigned you",
            target: "physics paper.",
            avatar: "/assets/images/avatar-male-1.png",
            type: "assignment"
        },
        {
            id: 2,
            user: "Mathematics",
            action: "lesson is assigned to you by",
            target: "Kiran Kumari",
            avatar: "/assets/images/avatar-male-2.png",
            type: "lesson"
        },
        {
            id: 3,
            user: "Bhagabati Das",
            action: "replied to your",
            target: "physics paper feedback",
            avatar: "/assets/images/avatar-male-1.png",
            type: "reply"
        },
        {
            id: 4,
            user: "Bhagabati Das",
            action: "assigned you",
            target: "physics paper.",
            avatar: "/assets/images/avatar-male-1.png",
            type: "assignment"
        },
        {
            id: 5,
            user: "Prsad Harichandan",
            action: "assigned you",
            target: "social science paper.",
            avatar: "/assets/images/avatar-male-2.png",
            type: "assignment"
        },
    ];
}

/**
 * Legacy function - fetch all data at once (for backward compatibility)
 * Use individual streaming functions above for better UX
 */
export async function getTeacherDashboardData(): Promise<TeacherDashboardData> {
    // TODO: Replace with actual API call when backend is ready
    // Example implementation:
    // const response = await fetch('/api/teacher/dashboard', {
    //     headers: {
    //         'Authorization': `Bearer ${getAuthToken()}`,
    //         'Content-Type': 'application/json'
    //     }
    // });
    // if (!response.ok) throw new Error('Failed to fetch dashboard data');
    // const result = await response.json();
    // return result.data;

    // Fetch all data in parallel
    const [info, stats, revenueData, likeabilityData, notifications] = await Promise.all([
        getTeacherInfo(),
        getTeacherStats(),
        getRevenueData(),
        getLikeabilityData(),
        getNotifications(),
    ]);

    return {
        teacherName: "Mrunal Mishra",
        stats: [
            {
                id: "earnings",
                title: "TOTAL EARNINGS",
                value: "₹11.3k",
                subValue: "+300",
                lastMonthValue: "₹11k",
                trend: "up",
                theme: "green"
            },
            {
                id: "purchased",
                title: "TOTAL PURCHASED PAPERS",
                value: "141",
                subValue: "+ 14",
                lastMonthValue: "137",
                trend: "up",
                theme: "orange"
            },
            {
                id: "created",
                title: "PAPERS CREATED",
                value: "11",
                subValue: "+1",
                lastMonthValue: "10",
                trend: "up",
                theme: "purple"
            },
            {
                id: "trending",
                title: "TRENDING PAPERS",
                value: "03",
                subValue: "+1",
                lastMonthValue: "2",
                trend: "up",
                theme: "yellow"
            }
        ],
        revenueData: [
            { name: "Jan", value: 8000 },
            { name: "Feb", value: 3200 },
            { name: "Mar", value: 5000 },
            { name: "Apr", value: 10000 },
            { name: "May", value: 7000 },
            { name: "Jun", value: 8500 },
            { name: "Jul", value: 6500 },
            { name: "Aug", value: 7200 },
            { name: "Sep", value: 7200 },
            { name: "Oct", value: 6000 },
            { name: "Nov", value: 7200 },
            { name: "Dec", value: 11000 },
        ],
        likeabilityData: [
            { name: "Jan", value: 15 },
            { name: "Feb", value: 45 },
            { name: "Mar", value: 48 },
            { name: "Apr", value: 75 },
            { name: "May", value: 95 },
            { name: "Jun", value: 50 },
            { name: "Jul", value: 40 },
            { name: "Aug", value: 60 },
            { name: "Sep", value: 85 },
            { name: "Oct", value: 78 },
            { name: "Nov", value: 65 },
            { name: "Dec", value: 60 },
        ],
        notifications: [
            {
                id: 1,
                user: "Bhagabati Das",
                action: "assigned you",
                target: "physics paper.",
                avatar: "/assets/images/avatar-male-1.png",
                type: "assignment"
            },
            {
                id: 2,
                user: "Mathematics",
                action: "lesson is assigned to you by",
                target: "Kiran Kumari",
                avatar: "/assets/images/avatar-male-2.png",
                type: "lesson"
            },
            {
                id: 3,
                user: "Bhagabati Das",
                action: "replied to your",
                target: "physics paper feedback",
                avatar: "/assets/images/avatar-male-1.png",
                type: "reply"
            },
            {
                id: 4,
                user: "Bhagabati Das",
                action: "assigned you",
                target: "physics paper.",
                avatar: "/assets/images/avatar-male-1.png",
                type: "assignment"
            },
            {
                id: 5,
                user: "Prsad Harichandan",
                action: "assigned you",
                target: "social science paper.",
                avatar: "/assets/images/avatar-male-2.png",
                type: "assignment"
            },
        ]
    };
}
