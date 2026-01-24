export interface Chapter {
    id: string;
    name: string;
    selected: boolean;
}

export type QuestionType = "Text" | "MCQ";
export type Difficulty = "Easy" | "Intermediate" | "Advanced";

export interface Question {
    id: string;
    type: QuestionType;
    difficulty: Difficulty;
    content: string;
    solution: string;
    marks?: number;
}

export interface PaperConfig {
    title: string;
    standard: string;
    subject: string;
    difficulty: Difficulty;
    chapters: Chapter[];
    isTimeBound: boolean;
    isPublic: boolean;
    duration: number;
    price: number;
    questions?: Question[]; // Added questions array
}
