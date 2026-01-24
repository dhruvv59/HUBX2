export type ExcursionStatusType = "consent" | "interest";

export interface Excursion {
    id: string;
    companyName: string;
    industry: string;
    logoUrl: string;
    dateBadge?: string;
    rating: number;
    duration: string;
    maxStudents: number;
    visits: number;
    votes: number;
    location: string;
    description: string;
    tags: string[];
    // Status Logic
    statusType: ExcursionStatusType;
    statusValue: number; // percentage or count
    statusTotal?: number; // e.g. 21/30
    statusLabel?: string; // e.g. "Need 41% more vote"
    // Flags
    highDemand?: boolean;
    isApproved?: boolean;
    showConsentButton?: boolean;
}

export interface ExcursionFilters {
    search: string;
    company: string;
    type: string;
    page: number;
}
