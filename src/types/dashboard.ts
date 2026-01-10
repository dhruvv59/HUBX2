export interface TrendData {
    value: string;
    isUp: boolean;
    color?: string; // Tailwind class
}

export interface StatCardData {
    id: string;
    title: string;
    value: string | number;
    subtext?: string;
    trend?: TrendData;
    gradient: string; // Tailwind class or raw CSS
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
    score: string; // "43%"
    scoreColorClass: string;
}

export interface PeerRankData {
    x: number;
    y: number;
}

export interface DashboardData {
    user: {
        name: string;
    };
    stats: StatCardData[];
    papers: PaperStatData[];
    performanceData: ChartDataPoint[];
    notifications: Notification[];
    focusAreas: FocusArea[];
    // Additional data for widgets can be added here
}
