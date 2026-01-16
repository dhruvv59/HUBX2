import { AssessmentDetail, AssessmentFilters, AssessmentResult, Subject } from "@/types/assessment";

// --- MOCK DATABASE ---

const MOCK_PAST_ASSESSMENTS: AssessmentResult[] = [
    {
        id: "21",
        title: "Assessment 21",
        level: "Advanced",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        date: "29 Oct 2025",
        scoreObtained: 210,
        totalScore: 300,
        durationTakenString: "90/90 mins",
        correctCount: 42,
        wrongCount: 18,
        totalQuestions: 60,
        flags: 1,
        doubts: 1,
        marked: 2,
        percentage: 70
    },
    {
        id: "20",
        title: "Assessment 20",
        level: "Beginner",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        date: "29 Oct 2025",
        scoreObtained: 252,
        totalScore: 300,
        durationTakenString: "85/90 mins",
        correctCount: 50,
        wrongCount: 10,
        totalQuestions: 60,
        flags: 0,
        doubts: 0,
        marked: 1,
        percentage: 84
    },
    {
        id: "19",
        title: "Assessment 19",
        level: "Intermediate",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        date: "29 Oct 2025",
        scoreObtained: 159,
        totalScore: 300,
        durationTakenString: "90/90 mins",
        correctCount: 30,
        wrongCount: 30,
        totalQuestions: 60,
        flags: 2,
        doubts: 1,
        marked: 5,
        percentage: 53
    },
    {
        id: "18",
        title: "Assessment 18",
        level: "Advanced",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        date: "29 Oct 2025",
        scoreObtained: 93,
        totalScore: 300,
        durationTakenString: "90/90 mins",
        correctCount: 18,
        wrongCount: 42,
        totalQuestions: 60,
        flags: 5,
        doubts: 2,
        marked: 0,
        percentage: 31
    }
];

const MOCK_ASSESSMENT_DETAIL: AssessmentDetail = {
    id: "21",
    title: "Comprehensive Assessment 21",
    subjects: ["Social Science", "Mathematics", "Science"],
    level: "Advanced",
    totalScore: 300,
    durationSeconds: 5400, // 90 mins
    questions: [
        {
            id: 1,
            text: "What is the speed of light in vacuum?",
            type: "MCQ",
            points: 5,
            options: [
                { id: "A", text: "3 × 10⁸ m/s" },
                { id: "B", text: "3 × 10⁶ m/s" },
                { id: "C", text: "2 × 10⁸ m/s" },
                { id: "D", text: "4 × 10⁸ m/s" },
            ],
            correctAnswer: "A"
        },
        {
            id: 2,
            text: "Solve for x: 2x + 5 = 15",
            type: "MCQ",
            points: 5,
            options: [
                { id: "A", text: "x = 4" },
                { id: "B", text: "x = 5" },
                { id: "C", text: "x = 10" },
                { id: "D", text: "x = 2" },
            ],
            correctAnswer: "B"
        },
        {
            id: 3,
            text: "Which event triggered the start of World War I?",
            type: "MCQ",
            points: 5,
            options: [
                { id: "A", text: "Invasion of Poland" },
                { id: "B", text: "Assassination of Archduke Franz Ferdinand" },
                { id: "C", text: "The Bolshevik Revolution" },
                { id: "D", text: "The sinking of the Lusitania" },
            ],
            correctAnswer: "B"
        },
        {
            id: 4,
            text: "What is the chemical symbol for Gold?",
            type: "MCQ",
            points: 5,
            options: [
                { id: "A", text: "Ag" },
                { id: "B", text: "Au" },
                { id: "C", text: "Fe" },
                { id: "D", text: "Hg" },
            ],
            correctAnswer: "B"
        },
        {
            id: 5,
            text: "Who wrote 'Romeo and Juliet'?",
            type: "MCQ",
            points: 5,
            options: [
                { id: "A", text: "Charles Dickens" },
                { id: "B", text: "William Shakespeare" },
                { id: "C", text: "Jane Austen" },
                { id: "D", text: "Mark Twain" },
            ],
            correctAnswer: "B"
        },
        // Generating some filler questions that vary slightly to simulate a longer test
        ...Array.from({ length: 15 }).map((_, i) => ({
            id: i + 6,
            text: `(Math) What is ${i + 2} * ${i + 3}?`,
            type: "MCQ",
            points: 5,
            options: [
                { id: "A", text: `${(i + 2) * (i + 3)}` },
                { id: "B", text: `${(i + 2) * (i + 3) + 2}` },
                { id: "C", text: `${(i + 2) * (i + 3) - 5}` },
                { id: "D", text: `${(i + 2) * (i + 3) + 10}` },
            ],
            correctAnswer: "A"
        })) as any
    ]
};

const MOCK_SUBJECTS: Subject[] = [
    {
        id: "science",
        name: "Science",
        score: 92,
        performance: "Excellent",
        chapters: Array.from({ length: 10 }).map((_, i) => ({ id: `sci-${i}`, name: `Science Chapter ${i + 1}` })),
    },
    {
        id: "mathematics",
        name: "Mathematics",
        score: 59,
        performance: "Average",
        chapters: Array.from({ length: 15 }).map((_, i) => ({ id: `math-${i}`, name: `Math Chapter ${i + 1}` })),
    },
    {
        id: "geography",
        name: "Geography",
        score: 84,
        performance: "Excellent",
        chapters: Array.from({ length: 8 }).map((_, i) => ({ id: `geo-${i}`, name: `Geography Chapter ${i + 1}` })),
    },
    {
        id: "english",
        name: "English",
        score: 89,
        performance: "Excellent",
        chapters: Array.from({ length: 12 }).map((_, i) => ({ id: `eng-${i}`, name: `English Chapter ${i + 1}` })),
    },
    {
        id: "hindi",
        name: "Hindi",
        score: 81,
        performance: "Excellent",
        chapters: Array.from({ length: 10 }).map((_, i) => ({ id: `hin-${i}`, name: `Hindi Chapter ${i + 1}` })),
    },
    {
        id: "social_science",
        name: "Social Science",
        score: 37,
        performance: "Poor",
        chapters: [
            { id: "ss-1", name: "The French Revolution" },
            { id: "ss-2", name: "Socialism in Europe and the Russian Revolution" },
            { id: "ss-3", name: "Nazism and the Rise of Hitler" },
            { id: "ss-4", name: "Forest, Society and Colonialism" },
            { id: "ss-5", name: "Pastoralists in the Modern World" },
            { id: "ss-6", name: "Natural Vegetation and Wildlife" },
            { id: "ss-7", name: "Interdisciplinary project as part of multiple assessments" },
            { id: "ss-8", name: "Population" },
            { id: "ss-9", name: "What is Democracy?" },
            { id: "ss-10", name: "Constitutional Desig" },
            { id: "ss-11", name: "Electoral Politics" },
            { id: "ss-12", name: "Working of Institutions" },
            { id: "ss-13", name: "Democratic Rights" },
        ],
    },
    {
        id: "it",
        name: "Information Technology",
        score: 94,
        performance: "Excellent",
        chapters: Array.from({ length: 5 }).map((_, i) => ({ id: `it-${i}`, name: `IT Chapter ${i + 1}` })),
    },
    {
        id: "economics",
        name: "Economics",
        score: 44,
        performance: "Poor",
        chapters: Array.from({ length: 8 }).map((_, i) => ({ id: `eco-${i}`, name: `Economics Chapter ${i + 1}` })),
    },
];

// --- SERVICES ---

/**
 * Fetch available subjects and their performance stats.
 */
export async function getAssessmentSubjects(): Promise<Subject[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_SUBJECTS);
        }, 500);
    });
}


/**
 * Fetch past assessment results with optional filtering.
 */
export async function getPastAssessments(filters?: AssessmentFilters): Promise<AssessmentResult[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let results = [...MOCK_PAST_ASSESSMENTS];

            if (filters) {
                if (filters.search) {
                    const q = filters.search.toLowerCase();
                    results = results.filter(r =>
                        r.title.toLowerCase().includes(q) ||
                        r.tags.some(t => t.toLowerCase().includes(q))
                    );
                }

                if (filters.level && filters.level !== "All") {
                    results = results.filter(r => r.level === filters.level);
                }

                // Sorting logic
                if (filters.sortBy === "Most Recent") {
                    // Date parsing would happen here in real app
                } else if (filters.sortBy === "Score High-Low") {
                    results.sort((a, b) => b.percentage - a.percentage);
                } else if (filters.sortBy === "Score Low-High") {
                    results.sort((a, b) => a.percentage - b.percentage);
                }

                // Subject filter mock logic (checking tags)
                if (filters.subject && filters.subject !== "All") {
                    // In a real app we'd check if any subject tag matches or if we have a separate subject field
                    // For now, assuming tags contain subjects
                    // results = results.filter(...) 
                }
            }

            resolve(results);
        }, 600); // Network delay simulation
    });
}

/**
 * Fetch a specific assessment details by ID (for Taking the test).
 */
export async function getAssessmentDetail(id: string): Promise<AssessmentDetail> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In a real app, fetch by ID. Here we just return the ONE mock we have.
            if (id) {
                resolve({
                    ...MOCK_ASSESSMENT_DETAIL,
                    id: id,
                    title: `Assessment ${id}`
                });
            } else {
                reject("Assessment not found");
            }
        }, 800);
    });
}

/**
 * Submit assessment answers.
 */
export async function submitAssessment(id: string, answers: Record<number, string>): Promise<{ resultId: string, score: number }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock processing
            resolve({
                resultId: "new-result-123",
                score: 195 // Mock score
            });
        }, 1500);
    });
}
