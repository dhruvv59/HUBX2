import {
    DashboardData,
    DashboardApiResponse,
    ApiStudentProfile,
    ApiPerformanceMetrics,
    SyllabusData
} from "@/types/dashboard";
import { http, ApiError, NetworkError } from "@/lib/http-client";
import { DASHBOARD_ENDPOINTS } from "@/lib/api-config";

/**
 * ========================================
 * PRODUCTION API INTEGRATION
 * ========================================
 * This service handles all dashboard data fetching from the backend API.
 * 
 * ARCHITECTURE:
 * 1. API calls use the http client with automatic retry and error handling
 * 2. Raw API responses are transformed to match UI expectations (adapter pattern)
 * 3. All errors are properly typed and handled
 * 4. Mock data is used as fallback during development
 * 
 * TO SWITCH TO PRODUCTION API:
 * 1. Set NEXT_PUBLIC_API_BASE_URL in environment variables
 * 2. Set USE_MOCK_DATA to false
 * 3. Ensure backend API contract matches DashboardApiResponse type
 */

// Feature flag for development
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * ========================================
 * ADAPTER / TRANSFORMER LAYER
 * ========================================
 * Transforms raw API response to UI-friendly format
 * This decouples backend contract from frontend implementation
 */
function transformToDashboardData(apiResponse: DashboardApiResponse & { [key: string]: any }): DashboardData {
    return {
        user: {
            name: apiResponse.student.fullName,
            avatar: apiResponse.student.avatarUrl
        },
        stats: [
            {
                id: "rank",
                title: "PERFORMANCE RANK",
                value: apiResponse.performance.globalRank.current.toString(),
                trend: {
                    value: `+${apiResponse.performance.globalRank.trend}`,
                    isUp: apiResponse.performance.globalRank.trend > 0
                },
                gradient: "linear-gradient(135deg, #FFF1F2 0%, #F3E8FF 50%, #E0E7FF 100%)",
                isCustomGradient: true
            },
            {
                id: "score",
                title: "AVERAGE SCORE",
                value: apiResponse.performance.averageScore.current.toString(),
                subtext: "%",
                trend: {
                    value: `+ ${apiResponse.performance.averageScore.trend}%`,
                    isUp: apiResponse.performance.averageScore.trend > 0
                },
                gradient: "linear-gradient(135deg, #ECFCCB 0%, #DCFCE7 50%, #D1FAE5 100%)",
                isCustomGradient: true
            },
            {
                id: "time",
                title: "AVERAGE TIME TAKEN",
                value: apiResponse.performance.averageTimeBeforeSubmission.minutes.toString(),
                subtext: "mins",
                trend: {
                    value: `+ ${apiResponse.performance.averageTimeBeforeSubmission.trend}min`,
                    isUp: apiResponse.performance.averageTimeBeforeSubmission.trend < 0,
                    color: "text-orange-500"
                },
                gradient: "linear-gradient(135deg, #FAE8FF 0%, #E0F2FE 100%)",
                isCustomGradient: true
            }
        ],
        papers: apiResponse.papers || [],
        performanceData: apiResponse.performanceData || [],
        notifications: apiResponse.notifications || [],
        focusAreas: apiResponse.focusAreas || [],
        latestExcursion: apiResponse.latestExcursion || null,
        subjectPerformance: apiResponse.subjectPerformance || {
            currentSubject: "N/A",
            overallPercentage: 0,
            trend: "Stable",
            metrics: []
        },
        peerRank: apiResponse.peerRank || {
            currentRank: 0,
            currentPercentile: 0,
            highestRankPercentile: 0,
            history: []
        },
        recentActivities: apiResponse.recentActivities || [],
        dailyQuestion: apiResponse.dailyQuestion || {
            id: "",
            question: "",
            options: [],
            correctAnswer: 0,
            subject: ""
        },
        welcome: apiResponse.welcome || {
            greeting: "Hello",
            quote: "",
            daysLeft: 0,
            examName: ""
        },
        upcomingExams: apiResponse.upcomingExams || [],
        testRecommendations: apiResponse.testRecommendations || [],
        syllabus: apiResponse.syllabus || []
    };
}

/**
 * ========================================
 * MOCK DATA (Development/Fallback)
 * ========================================
 */
function getMockDashboardData(): DashboardApiResponse & { [key: string]: any } {
    return {
        student: {
            id: "student-123",
            fullName: "Akriti Singh",
            avatarUrl: "/assets/images/user-avatar.png",
        },
        performance: {
            globalRank: { current: 23, trend: 3 },
            averageScore: { current: 86, trend: 2.1 },
            averageTimeBeforeSubmission: { minutes: 59, trend: 1 }
        },
        dashboard_layout: {},
        syllabus: [
            { subject: "Mathematics", totalChapters: 14, completedChapters: 8, hexColor: "#fca5a5", color: "bg-red-300" },
            { subject: "Science", totalChapters: 16, completedChapters: 12, hexColor: "#86efac", color: "bg-green-300" },
            { subject: "English", totalChapters: 10, completedChapters: 9, hexColor: "#fdba74", color: "bg-orange-300" },
            { subject: "Social Science", totalChapters: 20, completedChapters: 11, hexColor: "#fde047", color: "bg-yellow-300" }
        ],
        papers: [
            {
                id: "practice",
                title: "PRACTICE PAPERS",
                count: 96,
                badgeCount: 3,
                borderColorClass: "border-orange-200",
                link: "/practice-papers"
            },
            {
                id: "public",
                title: "PUBLIC PAPERS",
                count: 23,
                badgeCount: 2,
                borderColorClass: "border-green-200",
                link: "/papers"
            }
        ],
        performanceData: [
            { name: "Science", score: 81, fill: "#86efac" },
            { name: "Mathematics", score: 32, fill: "#fca5a5" },
            { name: "Geography", score: 50, fill: "#fde047" },
            { name: "English", score: 90, fill: "#86efac" },
            { name: "Hindi", score: 73, fill: "#86efac" },
            { name: "Social Science", score: 86, fill: "#86efac" },
            { name: "Info Tech", score: 68, fill: "#fde047" },
            { name: "Economics", score: 71, fill: "#86efac" },
        ],
        notifications: [
            { id: 1, author: "Bhagabati Das", text: "assigned you physics paper.", avatar: "/assets/images/teacher1.png" },
            { id: 2, author: "Romana Khan", text: "lesson is assigned to you by Kiran Kumari", avatar: "/assets/images/teacher2.png" },
            { id: 3, author: "Bhagabati Das", text: "replied to your physics paper feedback", avatar: "/assets/images/teacher1.png" },
            { id: 4, author: "Bhagabati Das", text: "assigned you physics paper.", avatar: "/assets/images/teacher1.png" },
            { id: 5, author: "Prsad Harichandan", text: "assigned you social science paper.", avatar: "/assets/images/teacher3.png" },
        ],
        focusAreas: [
            { id: "1", subject: "Mathematics", topic: "Complex Numbers", score: "43%", scoreColorClass: "text-red-500" },
            { id: "2", subject: "Physics", topic: "Thermodynamics", score: "37%", scoreColorClass: "text-red-500" },
            { id: "3", subject: "Social Science", topic: "India and the Contemporary World – I", score: "33%", scoreColorClass: "text-red-500" },
            { id: "4", subject: "Geography", topic: "Natural Vegetation and Wildlife", score: "37%", scoreColorClass: "text-red-500" },
        ],
        latestExcursion: {
            id: "glenmark-001",
            title: "APPROVED EXCURSION - GLENMARK PVT. LTD.",
            status: "Approved",
            link: "/excursion"
        },
        subjectPerformance: {
            currentSubject: "Social Science",
            overallPercentage: 58,
            trend: "Stable",
            metrics: [
                { subject: "Social Science", score: 58, color: "#fde047" },
                { subject: "Mathematics", score: 32, color: "#fca5a5" },
                { subject: "Science", score: 81, color: "#86efac" },
                { subject: "English", score: 90, color: "#86efac" },
            ]
        },
        peerRank: {
            currentRank: 23,
            currentPercentile: 86,
            highestRankPercentile: 98,
            history: [
                { x: 0, y: 5 }, { x: 10, y: 8 }, { x: 20, y: 12 }, { x: 30, y: 18 },
                { x: 40, y: 26 }, { x: 50, y: 38 }, { x: 60, y: 52 }, { x: 70, y: 68 },
                { x: 80, y: 86 }, { x: 90, y: 95 }, { x: 100, y: 98 }
            ]
        },
        recentActivities: [
            { id: "1", action: "Completed Mock Test", subject: "Mathematics", target: "Algebra & Geometry", timestamp: "2 hours ago", score: 82, isPositive: true },
            { id: "2", action: "Finished Practice", subject: "Science", target: "Chemical Reactions", timestamp: "Yesterday", isPositive: true },
            { id: "3", action: "Attempted Quiz", subject: "English", target: "Grammar: Tenses", timestamp: "Yesterday", score: 65, isPositive: false },
            { id: "4", action: "Viewed Solution", subject: "Physics", target: "Motion Laws", timestamp: "2 days ago" },
        ],
        dailyQuestion: {
            id: "q-1",
            question: "Which of the following is NOT a noble gas?",
            options: ["Helium", "Radon", "Nitrogen", "Xenon"],
            correctAnswer: 2,
            subject: "Science - Chemistry"
        },
        welcome: {
            greeting: "Good Morning",
            quote: "Success is the sum of small efforts repeated day in and day out.",
            daysLeft: 45,
            examName: "Final Board Exam"
        },
        upcomingExams: [
            { id: "1", title: "Mathematics Full Mock", date: "26 Aug, 2025", time: "10:00 AM", subject: "Mathematics", type: "Mock Test" },
            { id: "2", title: "Physics Chapter 3 Quiz", date: "28 Aug, 2025", time: "02:00 PM", subject: "Science", type: "Quiz" },
            { id: "3", title: "English Grammar Test", date: "30 Aug, 2025", time: "11:30 AM", subject: "English", type: "Mock Test" },
        ],
        testRecommendations: [
            { id: "1", title: "Target Series: Force & Motion", subject: "Physics", difficulty: "Medium", questions: 25, time: "30 mins", type: "AI Generated" },
            { id: "2", title: "PYQ 2023 - Algebra Set A", subject: "Mathematics", difficulty: "Hard", questions: 40, time: "60 mins", type: "Previous Year" },
            { id: "3", title: "Quick Revisio: Tenses", subject: "English", difficulty: "Easy", questions: 15, time: "10 mins", type: "System" },
        ]
    };
}

/**
 * ========================================
 * PUBLIC API - SERVICE LAYER
 * ========================================
 */

/**
 * Fetches complete dashboard data
 * 
 * @throws {ApiError} When API returns an error response
 * @throws {NetworkError} When network request fails
 * @returns Promise<DashboardData> Transformed dashboard data ready for UI
 * 
 * INTEGRATION NOTES:
 * - Backend endpoint: GET /api/v1/dashboard
 * - Expected response format: DashboardApiResponse
 * - Authentication: JWT token in Authorization header (handled by http client)
 * - Cache: Consider adding React Query or SWR for automatic caching
 */
export async function getDashboardData(): Promise<DashboardData> {
    // Development mode: Use mock data
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = getMockDashboardData();
                const transformedData = transformToDashboardData(mockData);
                resolve(transformedData);
            }, 800); // Simulate network latency
        });
    }

    // Production mode: Fetch from real API
    try {
        const apiResponse = await http.get<DashboardApiResponse & { [key: string]: any }>(
            DASHBOARD_ENDPOINTS.getDashboard()
        );

        return transformToDashboardData(apiResponse);
    } catch (error) {
        // Log error for monitoring (e.g., Sentry, Datadog)
        console.error('[Dashboard Service] Failed to fetch dashboard data:', error);

        // Re-throw typed errors for component-level handling
        if (error instanceof ApiError || error instanceof NetworkError) {
            throw error;
        }

        // Wrap unknown errors
        throw new Error('An unexpected error occurred while loading dashboard data');
    }
}

/**
 * Additional optimized endpoints for future use
 * These can be used for partial updates without refetching entire dashboard
 */

export async function getPerformanceStats(): Promise<ApiPerformanceMetrics> {
    if (USE_MOCK_DATA) {
        return getMockDashboardData().performance;
    }
    return http.get<ApiPerformanceMetrics>(DASHBOARD_ENDPOINTS.getStats());
}

export async function getUpcomingExams() {
    if (USE_MOCK_DATA) {
        return getMockDashboardData().upcomingExams;
    }
    return http.get(DASHBOARD_ENDPOINTS.getUpcomingExams());
}

export async function getSyllabusCoverage(): Promise<SyllabusData[]> {
    if (USE_MOCK_DATA) {
        return getMockDashboardData().syllabus;
    }
    return http.get<SyllabusData[]>(DASHBOARD_ENDPOINTS.getSyllabusCoverage());
}
