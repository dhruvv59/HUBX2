// Existing interfaces
export interface TrendData {
    value: string;
    isUp: boolean;
    color?: string;
}

export interface StatCardData {
    id: string;
    title: string;
    value: string | number;
    subtext?: string;
    trend?: TrendData;
    gradient: string;
    isCustomGradient?: boolean;
}

export interface PaperStatData {
    id: string;
    title: string;
    count: number;
    badgeCount?: number;
    borderColorClass: string;
}

export interface ChartDataPoint {
    name: string;
    score: number;
    fill: string;
}

export interface Notification {
    id: number;
    author: string;
    text: string;
    avatar: string; // URL
}

export interface FocusArea {
    id: string;
    subject: string;
    topic: string;
    score: string;
    scoreColorClass: string;
}

// New Interfaces for Dynamic Widgets

export interface ExcursionData {
    id: string;
    title: string;
    status: string;
    link: string;
}

export interface SubjectPerformanceMetric {
    subject: string;
    score: number; // 0-100
    color: string;
}

export interface SubjectPerformanceData {
    currentSubject: string;
    metrics: SubjectPerformanceMetric[]; // For the dropdown
    overallPercentage: number;
    trend: string;
}

export interface PeerRankPoint {
    x: number; // Percentile (0-100)
    y: number; // Curve value
}

export interface PeerRankData {
    currentRank: number;
    currentPercentile: number;
    history: PeerRankPoint[]; // The curve data
    highestRankPercentile: number;
}

export interface DashboardData {
    user: {
        name: string;
        avatar?: string;
    };
    stats: StatCardData[];
    papers: PaperStatData[];
    performanceData: ChartDataPoint[]; // For the main Performance Chart
    notifications: Notification[];
    focusAreas: FocusArea[];

    // New Dynamic Data Fields
    latestExcursion: ExcursionData | null;
    subjectPerformance: SubjectPerformanceData;
    peerRank: PeerRankData;
}
