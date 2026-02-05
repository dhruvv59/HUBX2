import { PrivatePaper, PrivatePaperFilters } from "@/types/private-paper";

const MOCK_PAPERS: PrivatePaper[] = [
    {
        id: "p1",
        title: "Mathematics Fundamental Test",
        std: "9th",
        subject: "Mathematics",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        difficulty: "Advanced",
        rating: 4.5,
        questionsCount: 35,
        duration: 60,
        attempts: 117,
        date: "29 Oct 2025",
        plays: 159,
        teacher: {
            name: "Mrunal Sir",
            avatar: "/assets/images/avatar-male.svg"
        }
    },
    {
        id: "p2",
        title: "Science Physics Quiz",
        std: "9th",
        subject: "Science",
        tags: ["Physics", "Motion", "Force"],
        difficulty: "Beginner",
        rating: 4.2,
        questionsCount: 20,
        duration: 45,
        attempts: 85,
        date: "30 Oct 2025",
        plays: 92,
        teacher: {
            name: "Priya Ma'am",
            avatar: "/assets/images/avatar-female.svg"
        }
    },
    {
        id: "p3",
        title: "Chemistry Organic Basics",
        std: "10th",
        subject: "Science",
        tags: ["Chemistry", "Organic", "Carbon"],
        difficulty: "Intermediate",
        rating: 4.8,
        questionsCount: 50,
        duration: 90,
        attempts: 200,
        date: "01 Nov 2025",
        plays: 340,
        teacher: {
            name: "Rahul Sir",
            avatar: "/assets/images/avatar-male.svg"
        }
    },
    {
        id: "p4",
        title: "Algebra Advanced Concepts",
        std: "10th",
        subject: "Mathematics",
        tags: ["Algebra", "Polynomials"],
        difficulty: "Advanced",
        rating: 4.6,
        questionsCount: 40,
        duration: 75,
        attempts: 150,
        date: "05 Nov 2025",
        plays: 210,
        teacher: {
            name: "Mrunal Sir",
            avatar: "/assets/images/avatar-male.svg"
        }
    },
    {
        id: "p5",
        title: "Biology Cell Structure",
        std: "8th",
        subject: "Science",
        tags: ["Biology", "Cell", "Life"],
        difficulty: "Beginner",
        rating: 4.0,
        questionsCount: 15,
        duration: 30,
        attempts: 50,
        date: "10 Nov 2025",
        plays: 60,
        teacher: {
            name: "Sonia Ma'am",
            avatar: "/assets/images/avatar-female.svg"
        }
    },
    {
        id: "p6",
        title: "Geometry Shapes & Angles",
        std: "8th",
        subject: "Mathematics",
        tags: ["Geometry", "Shapes"],
        difficulty: "Beginner",
        rating: 4.1,
        questionsCount: 25,
        duration: 40,
        attempts: 70,
        date: "12 Nov 2025",
        plays: 85,
        teacher: {
            name: "Amit Sir",
            avatar: "/assets/images/avatar-male.svg"
        }
    }
];

export const getPrivatePapers = async (filters: PrivatePaperFilters): Promise<{ papers: PrivatePaper[], total: number }> => {
    // API Configuration
    // TODO: Move this to an environment variable in production
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
        const params = new URLSearchParams();

        // Append filters if they exist and are not "All"
        if (filters.subject && filters.subject !== "All") params.append("subject", filters.subject);
        if (filters.std && filters.std !== "All") params.append("std", filters.std); // 'std' param usually maps to 'standard' or 'class' in DB
        if (filters.difficulty && filters.difficulty !== "All") params.append("difficulty", filters.difficulty);
        if (filters.search) params.append("q", filters.search);

        // Pagination & Sorting
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
        if (filters.sortBy) {
            // Map UI sort keys to API sort keys
            const sortMapping: { [key: string]: string } = {
                "Most Recent": "newest",
                "Most Popular": "popular",
                "Highest Rated": "rating"
            };
            params.append("sort", sortMapping[filters.sortBy] || "newest");
        }

        const response = await fetch(`${API_BASE_URL}/private-papers?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header if you utilize a token system
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            // cache: 'no-store' // depending on Next.js caching needs
        });

        if (!response.ok) {
            // If 404 or 500, we might want to return empty or throw
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Ensure the response structure matches our expectation
        // Expected API Response: { data: PrivatePaper[], meta: { total: number } }
        return {
            papers: data.data || [],
            total: data.meta?.total || data.total || 0
        };

    } catch (error) {
        // Gracefully fall back to mock data when API is not available
        // In production, this allows the app to work even if backend is down
        // Only log actual network errors, not expected "API not available" scenarios
        const isNetworkError =
            (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message === 'fetch failed')) ||
            (error instanceof Error && (error as any).code === 'ECONNREFUSED');

        if (isNetworkError) {
            // Network error - API likely not running, use mock data silently
            console.info('API not available, using mock data');
        } else {
            // Actual error that should be logged
            console.error("Failed to fetch private papers:", error);
        }

        // Return mock data as fallback
        return getMockPrivatePapers(filters);
    }
};

// Helper function to keep the mock logic available as fallback
const getMockPrivatePapers = async (filters: PrivatePaperFilters): Promise<{ papers: PrivatePaper[], total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

    let filtered = [...MOCK_PAPERS];

    if (filters.subject && filters.subject !== "All") {
        filtered = filtered.filter(p => p.subject === filters.subject);
    }

    if (filters.std && filters.std !== "All") {
        filtered = filtered.filter(p => p.std === filters.std);
    }

    if (filters.difficulty && filters.difficulty !== "All") {
        filtered = filtered.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.teacher.name.toLowerCase().includes(query) ||
            p.tags.some(t => t.toLowerCase().includes(query))
        );
    }

    // Sorting
    if (filters.sortBy) {
        if (filters.sortBy === "Most Recent") {
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (filters.sortBy === "Most Popular") {
            filtered.sort((a, b) => b.plays - a.plays);
        } else if (filters.sortBy === "Highest Rated") {
            filtered.sort((a, b) => b.rating - a.rating);
        }
    }

    // Pagination Mock
    const page = filters.page || 1;
    const limit = filters.limit || 6;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
        papers: paginated,
        total: filtered.length
    };
};
