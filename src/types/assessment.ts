export type AssessmentLevel = "Beginner" | "Intermediate" | "Advanced";

export interface AnswerOption {
    id: string;
    text: string;
}

export interface Question {
    id: number;
    text: string;
    type: "MCQ" | "Text"; // Expandable for future
    options: AnswerOption[];
    correctAnswer?: string; // Should be hidden in a real safe exam browser, but fetched here for immediate feedback if allowed
    points: number;
}

export interface AssessmentDetail {
    id: string;
    title: string;
    subjects: string[]; // e.g. ["Mathematics", "Science"]
    level: AssessmentLevel;
    totalScore: number;
    durationSeconds: number; // e.g. 5400 for 90 mins
    questions: Question[];
}

export interface AssessmentResult {
    id: string;
    title: string;
    level: AssessmentLevel;
    tags: string[]; // Subject tags
    date: string; // ISO date or formatted string
    scoreObtained: number;
    totalScore: number;
    durationTakenString: string; // "90/90 mins"
    correctCount: number;
    wrongCount: number;
    totalQuestions: number;
    flags: number;
    doubts: number;
    marked: number;
    percentage: number;
}

export interface AssessmentFilters {
    subject?: string;
    level?: string; // "All" | AssessmentLevel
    search?: string;
    sortBy?: "Most Recent" | "Score High-Low" | "Score Low-High";
}

export type PerformanceLevel = "Excellent" | "Average" | "Poor";

export interface Chapter {
    id: string;
    name: string;
}

export interface Subject {
    id: string;
    name: string;
    score: number;
    performance: PerformanceLevel;
    chapters: Chapter[];
}

export interface PublicPaper {
    id: string;
    title: string;
    badges: string[]; // e.g., ["FEATURED"]
    price: number;
    level: AssessmentLevel;
    tags: string[]; // e.g., ["Algebra", "Geometry"]
    rating: number;
    questionCount: number;
    durationMinutes: number;
    attempts: number;
    date: string; // "29 Oct 2025"
    subject: string;
    teacher: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    purchased?: boolean;
}

export interface PaperFilters {
    subject?: string;
    level?: string;
    rating?: string; // "4 & above"
    search?: string;
    sortBy?: string;
    teacherId?: string;
}

export interface TeacherProfile {
    id: string;
    name: string;
    avatarUrl: string;
    rating: number;
    subjects: string[]; // "Mathematics", "Science"
    stats: {
        publicPapers: number;
        notifiedStudents: number;
    };
    bio?: string; // "Mathematics, Science, Social Science"
}

export interface TestSettings {
    noTimeLimit: boolean;
    showAnswersAfterWrong: boolean;
    inTestSolutionView: boolean;
}
