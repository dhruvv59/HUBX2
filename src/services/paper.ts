import { PublicPaper, PaperFilters, ApiPublicPaper } from "@/types/assessment";

// --- 1. RAW BACKEND RESPONSE (Mocked) ---
const MOCK_API_RESPONSE: ApiPublicPaper[] = [
    {
        paper_uuid: "1",
        paper_title: "Mathematics Fundamental Test",
        is_featured: true,
        cost_amount: 200,
        difficulty_grade: "ADVANCED",
        topic_tags: ["Algebra", "Geometry", "Trigonometry"],
        user_rating: 4.5,
        stats: { total_questions: 35, duration_minutes: 60, total_attempts: 117 },
        created_at_date: "2025-10-29T10:00:00Z",
        subject_name: "Mathematics",
        author: {
            teacher_id: "t1",
            display_name: "Mrunal Sir",
            profile_pic_url: "/assets/images/avatar-male-1.png"
        }
    },
    {
        paper_uuid: "2",
        paper_title: "Mathematics Fundamental Test",
        is_featured: false,
        cost_amount: 99,
        difficulty_grade: "BEGINNER",
        topic_tags: ["Algebra", "Geometry", "Trigonometry"],
        user_rating: 4.5,
        stats: { total_questions: 35, duration_minutes: 60, total_attempts: 117 },
        created_at_date: "2025-10-29T10:00:00Z",
        subject_name: "Mathematics",
        author: {
            teacher_id: "t2",
            display_name: "Prateik Sir",
            profile_pic_url: "/assets/images/avatar-male-2.png"
        }
    },
    {
        paper_uuid: "3",
        paper_title: "Mathematics Fundamental Test",
        is_featured: false,
        cost_amount: 120,
        difficulty_grade: "INTERMEDIATE",
        topic_tags: ["Algebra", "Geometry", "Trigonometry"],
        user_rating: 4.5,
        stats: { total_questions: 35, duration_minutes: 60, total_attempts: 117 },
        created_at_date: "2025-10-29T10:00:00Z",
        subject_name: "Mathematics",
        author: {
            teacher_id: "t3",
            display_name: "Sudarshan Sir",
            profile_pic_url: "/assets/images/avatar-male-3.png"
        }
    },
    {
        paper_uuid: "4",
        paper_title: "Mathematics Fundamental Test",
        is_featured: true,
        cost_amount: 140,
        difficulty_grade: "ADVANCED",
        topic_tags: ["Algebra", "Geometry", "Trigonometry"],
        user_rating: 4.5,
        stats: { total_questions: 35, duration_minutes: 60, total_attempts: 117 },
        created_at_date: "2025-10-29T10:00:00Z",
        subject_name: "Mathematics",
        author: {
            teacher_id: "t4",
            display_name: "Rajveer Sir",
            profile_pic_url: "/assets/images/avatar-male-4.png"
        }
    }
];


// --- 2. ADAPTER / MAPPER LAYER ---

function transformPublicPaper(apiPaper: ApiPublicPaper): PublicPaper {
    const levelMap: Record<string, "Advanced" | "Beginner" | "Intermediate"> = {
        "ADVANCED": "Advanced",
        "BEGINNER": "Beginner",
        "INTERMEDIATE": "Intermediate"
    };

    return {
        id: apiPaper.paper_uuid,
        title: apiPaper.paper_title,
        badges: apiPaper.is_featured ? ["FEATURED"] : [],
        price: apiPaper.cost_amount,
        level: levelMap[apiPaper.difficulty_grade] || "Intermediate",
        tags: apiPaper.topic_tags,
        rating: apiPaper.user_rating,
        questionCount: apiPaper.stats.total_questions,
        durationMinutes: apiPaper.stats.duration_minutes,
        attempts: apiPaper.stats.total_attempts,
        date: new Date(apiPaper.created_at_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
        subject: apiPaper.subject_name,
        teacher: {
            id: apiPaper.author.teacher_id,
            name: apiPaper.author.display_name,
            avatarUrl: apiPaper.author.profile_pic_url
        }
    };
}


// --- 3. SERVICES (API Calls) ---

export async function getPublicPapers(filters: PaperFilters = {}): Promise<PublicPaper[]> {
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In reality, filters would be sent as query params to the backend
    let filteredApiData = [...MOCK_API_RESPONSE];

    // Simulate Backend Filtering
    if (filters.subject && filters.subject !== "All") {
        filteredApiData = filteredApiData.filter(p => p.subject_name === filters.subject);
    }

    // Transform mock response to UI Model
    let uiPapers = filteredApiData.map(transformPublicPaper);

    // Apply remaining filters (UI side for now)
    if (filters.level && filters.level !== "All") {
        uiPapers = uiPapers.filter(p => p.level === filters.level);
    }

    if (filters.rating && filters.rating.includes("4")) {
        uiPapers = uiPapers.filter(p => p.rating >= 4.0);
    }

    if (filters.search) {
        const q = filters.search.toLowerCase();
        uiPapers = uiPapers.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.teacher.name.toLowerCase().includes(q) ||
            p.subject.toLowerCase().includes(q)
        );
    }

    // Sort
    if (filters.sortBy) {
        if (filters.sortBy === "Price: Low to High") {
            uiPapers.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "Price: High to Low") {
            uiPapers.sort((a, b) => b.price - a.price);
        }
    }

    return uiPapers;
}

/**
 * Gets the count of purchased papers for the current student
 * Returns 0 if no papers purchased
 * Used to conditionally show "Purchased Papers" button on dashboard
 */
export async function getPurchasedPapersCount(): Promise<number> {
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // In reality, this would call: GET /api/papers/purchased/count
    // For demo, we'll simulate some purchased papers
    // In real implementation, backend would track purchased papers per student

    // Mock: Return a count (3 purchased papers for demo)
    return 3;
}

/**
 * Gets list of purchased papers for the current student
 */
export async function getPurchasedPapers(): Promise<PublicPaper[]> {
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In reality, this would call: GET /api/papers/purchased
    // For now, simulate returning some purchased papers
    const allPapers = await getPublicPapers({});

    // Mark first 3 papers as purchased for demo
    return allPapers.slice(0, 3).map(p => ({ ...p, purchased: true }));
}
