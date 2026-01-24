import { Question } from "@/types/generate-paper";

export interface QuestionBankFilter {
    subject?: string;
    difficulty?: string[];
    rating?: string;
    addedTime?: string;
}

export const MOCK_BANK_QUESTIONS: Question[] = [
    {
        id: "bank-1",
        type: "Text",
        difficulty: "Intermediate",
        content: "Distinguish between boiling and evaporation.",
        solution: "Occurs throughout the liquid. Occurs only at the surface of the liquid. Happens at a fixed temperature called the boiling point. Can occur at any temperature, even below the boiling point.",
        marks: 5
    },
    {
        id: "bank-2",
        type: "Text",
        difficulty: "Easy",
        content: "Define Newton's Second Law.",
        solution: "Force equals mass times acceleration (F=ma).",
        marks: 2
    },
    {
        id: "bank-3",
        type: "Text",
        difficulty: "Intermediate",
        content: "Explain the process of photosynthesis.",
        solution: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.",
        marks: 5
    },
    {
        id: "bank-4",
        type: "Text",
        difficulty: "Advanced",
        content: "Derive the equation of state for an ideal gas.",
        solution: "PV = nRT",
        marks: 10
    },
    {
        id: "bank-5",
        type: "MCQ",
        difficulty: "Easy",
        content: "What is the powerhouse of the cell?",
        solution: "Mitochondria",
        marks: 1
    }
];

export const getBankQuestions = async (filters: QuestionBankFilter): Promise<Question[]> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    let filtered = [...MOCK_BANK_QUESTIONS];

    // Simple mock filtering
    if (filters.difficulty && filters.difficulty.length > 0 && !filters.difficulty.includes("All")) {
        filtered = filtered.filter(q => filters.difficulty?.includes(q.difficulty));
    }

    return filtered;
};
