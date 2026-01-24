import { DashboardData } from "@/types/dashboard";

const MOCK_DATA: DashboardData = {
    user: {
        name: "Akriti Singh",
        avatar: "/assets/images/user-avatar.png"
    },
    stats: [
        {
            id: "rank",
            title: "PERFORMANCE RANK",
            value: "23",
            trend: { value: "+3", isUp: true },
            gradient: "linear-gradient(135deg, #FFF1F2 0%, #F3E8FF 50%, #E0E7FF 100%)",
            isCustomGradient: true
        },
        {
            id: "score",
            title: "AVERAGE SCORE",
            value: "86",
            subtext: "%",
            trend: { value: "+ 2.1%", isUp: true },
            gradient: "linear-gradient(135deg, #ECFCCB 0%, #DCFCE7 50%, #D1FAE5 100%)",
            isCustomGradient: true
        },
        {
            id: "time",
            title: "AVERAGE TIME TAKEN",
            value: "59",
            subtext: "mins",
            trend: { value: "+ 1min", isUp: false, color: "text-orange-500" },
            gradient: "linear-gradient(135deg, #FAE8FF 0%, #E0F2FE 100%)",
            isCustomGradient: true
        }
    ],
    papers: [
        {
            id: "practice",
            title: "PRACTICE PAPERS",
            count: 96,
            badgeCount: 3,
            borderColorClass: "border-orange-200"
        },
        {
            id: "public",
            title: "PUBLIC PAPERS",
            count: 23,
            badgeCount: 2,
            borderColorClass: "border-green-200"
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
        {
            id: 1,
            author: "Bhagabati Das",
            text: "assigned you physics paper.",
            avatar: "/assets/images/teacher1.png"
        },
        {
            id: 2,
            author: "Romana Khan",
            text: "lesson is assigned to you by Kiran Kumari",
            avatar: "/assets/images/teacher2.png"
        },
        {
            id: 3,
            author: "Bhagabati Das",
            text: "replied to your physics paper feedback",
            avatar: "/assets/images/teacher1.png"
        },
        {
            id: 4,
            author: "Bhagabati Das",
            text: "assigned you physics paper.",
            avatar: "/assets/images/teacher1.png"
        },
        {
            id: 5,
            author: "Prsad Harichandan",
            text: "assigned you social science paper.",
            avatar: "/assets/images/teacher3.png"
        },
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
    }
};

/**
 * Simulates an Aynchronous API call to fetch dashboard data.
 * In production, this would be a fetch() call to your backend.
 */
export async function getDashboardData(): Promise<DashboardData> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_DATA);
        }, 800); // Simulate network latency
    });
}
