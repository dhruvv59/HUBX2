import { AssessmentDetail, AssessmentFilters, AssessmentResult, Subject, ApiSubject, ApiAssessmentResult, ApiAssessmentDetail } from "@/types/assessment";
import { ApiResponse } from "@/types/api";

// --- 1. RAW BACKEND RESPONSE (Mocked) ---
// This mocks exactly what the Node/Python backend will send
const MOCK_API_DATA = {
    subjects: [
        {
            subject_id: "science",
            display_name: "Science",
            current_score: 92,
            total_q_count: 500,
            chapters: Array.from({ length: 10 }).map((_, i) => ({
                sys_id: `sci-${i}`,
                title: `Science Chapter ${i + 1}`,
                q_count: 50
            })),
        },
        {
            subject_id: "mathematics",
            display_name: "Mathematics",
            current_score: 59,
            total_q_count: 450,
            chapters: Array.from({ length: 15 }).map((_, i) => ({
                sys_id: `math-${i}`,
                title: `Math Chapter ${i + 1}`,
                q_count: 30
            })),
        },
        {
            subject_id: "geography",
            display_name: "Geography",
            current_score: 84,
            total_q_count: 320,
            chapters: Array.from({ length: 8 }).map((_, i) => ({
                sys_id: `geo-${i}`,
                title: `Geography Chapter ${i + 1}`,
                q_count: 40
            })),
        },
        {
            subject_id: "social_science",
            display_name: "Social Science",
            current_score: 37,
            total_q_count: 200,
            chapters: [
                { sys_id: "ss-1", title: "The French Revolution", q_count: 50 },
                { sys_id: "ss-2", title: "Socialism in Europe and the Russian Revolution", q_count: 50 },
                { sys_id: "ss-3", title: "Nazism and the Rise of Hitler", q_count: 50 },
                { sys_id: "ss-4", title: "Forest, Society and Colonialism", q_count: 50 },
            ]
        }
    ] as ApiSubject[],

    pastExams: [
        {
            exam_id: "21",
            exam_title: "Assessment 21",
            difficulty_level: "ADVANCED",
            tags_list: ["Algebra", "Geometry", "Trigonometry"],
            submission_date: "2025-10-29T10:00:00Z",
            score_details: { obtained: 210, max: 300 },
            timings: { time_taken_seconds: 5400, total_duration_seconds: 5400 }, // 90 mins
            stats: { correct: 42, wrong: 18, total_qs: 60, flags: 1, doubts: 1, marked: 2 }
        },
        {
            exam_id: "20",
            exam_title: "Assessment 20",
            difficulty_level: "BEGINNER",
            tags_list: ["Algebra", "Geometry"],
            submission_date: "2025-10-28T14:30:00Z",
            score_details: { obtained: 252, max: 300 },
            timings: { time_taken_seconds: 5100, total_duration_seconds: 5400 },
            stats: { correct: 50, wrong: 10, total_qs: 60, flags: 0, doubts: 0, marked: 1 }
        }
    ] as ApiAssessmentResult[],

    examDetail: {
        exam_uuid: "21",
        exam_name: "Comprehensive Assessment 21",
        subject_names: ["Social Science", "Mathematics", "Science"],
        difficulty: "ADVANCED",
        max_marks: 300,
        allowed_time_seconds: 5400,
        question_paper: [
            {
                q_id: 1,
                problem_statement: "What is the speed of light in vacuum?",
                q_type: "MCQ",
                max_points: 5,
                answer_choices: [
                    { choice_id: "A", label: "3 × 10⁸ m/s" },
                    { choice_id: "B", label: "3 × 10⁶ m/s" },
                    { choice_id: "C", label: "2 × 10⁸ m/s" },
                    { choice_id: "D", label: "4 × 10⁸ m/s" },
                ],
                correct_choice_id: "A"
            },
            {
                q_id: 2,
                problem_statement: "Solve for x: 2x + 5 = 15",
                q_type: "MCQ",
                max_points: 5,
                answer_choices: [
                    { choice_id: "A", label: "x = 4" },
                    { choice_id: "B", label: "x = 5" },
                    { choice_id: "C", label: "x = 10" },
                    { choice_id: "D", label: "x = 2" },
                ],
                correct_choice_id: "B"
            }
        ]
    } as ApiAssessmentDetail
};


// --- 2. ADAPTER / MAPPER LAYER ---
// Transforms Raw API Data -> UI View Model

function transformSubject(apiSubject: ApiSubject): Subject {
    // Logic to determine performance string from score
    let perf: "Excellent" | "Average" | "Poor" = "Average";
    if (apiSubject.current_score >= 80) perf = "Excellent";
    else if (apiSubject.current_score <= 40) perf = "Poor";

    return {
        id: apiSubject.subject_id,
        name: apiSubject.display_name,
        score: apiSubject.current_score,
        performance: perf,
        totalQuestions: apiSubject.total_q_count,
        chapters: apiSubject.chapters.map(ch => ({
            id: ch.sys_id,
            name: ch.title,
            questionCount: ch.q_count
        }))
    };
}

function transformAssessmentResult(apiResult: ApiAssessmentResult): AssessmentResult {
    const percentage = Math.round((apiResult.score_details.obtained / apiResult.score_details.max) * 100);

    // Format duration string "90/90 mins"
    const takenMins = Math.round(apiResult.timings.time_taken_seconds / 60);
    const totalMins = Math.round(apiResult.timings.total_duration_seconds / 60);

    // Normalize level casing
    const levelMap: Record<string, "Advanced" | "Beginner" | "Intermediate"> = {
        "ADVANCED": "Advanced",
        "BEGINNER": "Beginner",
        "INTERMEDIATE": "Intermediate"
    };

    return {
        id: apiResult.exam_id,
        title: apiResult.exam_title,
        level: levelMap[apiResult.difficulty_level] || "Intermediate",
        tags: apiResult.tags_list,
        date: new Date(apiResult.submission_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }), // "29 Oct 2025"
        scoreObtained: apiResult.score_details.obtained,
        totalScore: apiResult.score_details.max,
        durationTakenString: `${takenMins}/${totalMins} mins`,
        correctCount: apiResult.stats.correct,
        wrongCount: apiResult.stats.wrong,
        totalQuestions: apiResult.stats.total_qs,
        flags: apiResult.stats.flags,
        doubts: apiResult.stats.doubts,
        marked: apiResult.stats.marked,
        percentage: percentage
    };
}

function transformAssessmentDetail(apiDetail: ApiAssessmentDetail): AssessmentDetail {
    // Normalize level casing
    const levelMap: Record<string, "Advanced" | "Beginner" | "Intermediate"> = {
        "ADVANCED": "Advanced",
        "BEGINNER": "Beginner",
        "INTERMEDIATE": "Intermediate"
    };

    return {
        id: apiDetail.exam_uuid,
        title: apiDetail.exam_name,
        subjects: apiDetail.subject_names,
        level: levelMap[apiDetail.difficulty] || "Intermediate",
        totalScore: apiDetail.max_marks,
        durationSeconds: apiDetail.allowed_time_seconds,
        questions: apiDetail.question_paper.map(q => ({
            id: q.q_id,
            text: q.problem_statement,
            type: q.q_type,
            points: q.max_points,
            options: q.answer_choices.map(c => ({ id: c.choice_id, text: c.label })),
            correctAnswer: q.correct_choice_id
        }))
    };
}


// --- 3. SERVICES (API Calls) ---

/**
 * Fetch available subjects and their performance stats.
 */
export async function getAssessmentSubjects(): Promise<Subject[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate API returning raw data -> mapped to UI data
            const uiData = MOCK_API_DATA.subjects.map(transformSubject);
            resolve(uiData);
        }, 500);
    });
}


/**
 * Fetch past assessment results with optional filtering.
 */
export async function getPastAssessments(filters?: AssessmentFilters): Promise<{ data: AssessmentResult[], total: number }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate more mock data for pagination testing
            const baseResults = MOCK_API_DATA.pastExams.map(transformAssessmentResult);
            let results = [...baseResults];

            // Generate extra mock items if needed
            for (let i = 1; i < 20; i++) {
                results.push({
                    ...baseResults[i % 2],
                    id: `mock-${i}`,
                    title: `Mock Assessment ${i}`,
                    percentage: Math.floor(Math.random() * 100),
                    date: "01 Nov 2025"
                });
            }

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

                if (filters.subject && filters.subject !== "All") {
                    // Mock subject filtering logic since mock data lacks explicit subject field in list
                    // We'll just randomly filter for demo purposes or ignore if strictly following types
                }

                // Sorting
                if (filters.sortBy === "Score High-Low") {
                    results.sort((a, b) => b.percentage - a.percentage);
                } else if (filters.sortBy === "Most Recent") {
                    // Mock logic for date sort
                }
            }

            const total = results.length;
            const page = filters?.page || 1;
            const limit = filters?.limit || 10;
            const startIndex = (page - 1) * limit;
            const paginatedData = results.slice(startIndex, startIndex + limit);

            resolve({ data: paginatedData, total });
        }, 600);
    });
}

/**
 * Fetch a specific assessment details by ID (for Taking the test).
 */
export async function getAssessmentDetail(id: string): Promise<AssessmentDetail> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In reality, search MOCK_API_DATA based on ID
            if (MOCK_API_DATA.examDetail) { // Using the single mock for now
                resolve(transformAssessmentDetail(MOCK_API_DATA.examDetail));
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
