import { PublicPaper, PaperFilters } from "@/types/assessment";

// Mock Data
const MOCK_PAPERS: PublicPaper[] = [
    {
        id: "1",
        title: "Mathematics Fundamental Test",
        badges: ["FEATURED"],
        price: 200,
        level: "Advanced",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        rating: 4.5,
        questionCount: 35,
        durationMinutes: 60,
        attempts: 117,
        date: "29 Oct 2025",
        subject: "Mathematics",
        teacher: {
            name: "Mrunal Sir",
            avatarUrl: "/assets/images/avatar-male-1.png"
        }
    },
    {
        id: "2",
        title: "Mathematics Fundamental Test",
        badges: [],
        price: 99,
        level: "Beginner",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        rating: 4.5,
        questionCount: 35,
        durationMinutes: 60,
        attempts: 117,
        date: "29 Oct 2025",
        subject: "Mathematics",
        teacher: {
            name: "Prateik Sir",
            avatarUrl: "/assets/images/avatar-male-2.png"
        }
    },
    {
        id: "3",
        title: "Mathematics Fundamental Test",
        badges: [],
        price: 120,
        level: "Intermediate",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        rating: 4.5,
        questionCount: 35,
        durationMinutes: 60,
        attempts: 117,
        date: "29 Oct 2025",
        subject: "Mathematics",
        teacher: {
            name: "Sudarshan Sir",
            avatarUrl: "/assets/images/avatar-male-3.png" // using placeholders, assuming assets exist or will default
        }
    },
    {
        id: "4",
        title: "Mathematics Fundamental Test",
        badges: ["FEATURED"],
        price: 140,
        level: "Advanced", // Matches color logic often
        tags: ["Algebra", "Geometry", "Trigonometry"],
        rating: 4.5,
        questionCount: 35,
        durationMinutes: 60,
        attempts: 117,
        date: "29 Oct 2025",
        subject: "Mathematics",
        teacher: {
            name: "Rajveer Sir",
            avatarUrl: "/assets/images/avatar-male-4.png"
        }
    }
];

export async function getPublicPapers(filters: PaperFilters = {}): Promise<PublicPaper[]> {
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_PAPERS];

    if (filters.subject && filters.subject !== "All") {
        filtered = filtered.filter(p => p.subject === filters.subject);
    }

    if (filters.level && filters.level !== "All") {
        filtered = filtered.filter(p => p.level === filters.level);
    }

    // Rating filter can be simple for now
    if (filters.rating) {
        // Assume "4 & above" logic if string matches
        if (filters.rating.includes("4")) {
            filtered = filtered.filter(p => p.rating >= 4.0);
        }
    }

    if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.teacher.name.toLowerCase().includes(q) ||
            p.subject.toLowerCase().includes(q)
        );
    }

    // Sort
    if (filters.sortBy) {
        if (filters.sortBy === "Most Recent") {
            // In a real app, parse date. Here assume mock order or specific date field
        } else if (filters.sortBy === "Price: Low to High") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "Price: High to Low") {
            filtered.sort((a, b) => b.price - a.price);
        }
    }

    return filtered;
}
