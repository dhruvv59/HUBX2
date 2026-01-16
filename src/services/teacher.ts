import { TeacherProfile, PublicPaper } from "@/types/assessment";

// Mock Teachers
const MOCK_TEACHERS: TeacherProfile[] = [
    {
        id: "t1",
        name: "Mrunal Sir",
        avatarUrl: "/assets/images/avatar-male-1.png",
        rating: 4.5,
        subjects: ["Mathematics", "Science", "Social Science"],
        stats: {
            publicPapers: 23,
            notifiedStudents: 1946
        }
    },
    {
        id: "t2",
        name: "Prateik Sir",
        avatarUrl: "/assets/images/avatar-male-2.png",
        rating: 4.2,
        subjects: ["Mathematics", "Physics"],
        stats: {
            publicPapers: 15,
            notifiedStudents: 850
        }
    }
];

export async function getTeacherById(id: string): Promise<TeacherProfile | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TEACHERS.find(t => t.id === id) || null;
}

export async function getTeacherPapers(teacherId: string, subjectFilter?: string, difficultyFilter?: string, searchQuery?: string): Promise<PublicPaper[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate some mock papers for this teacher to match the image
    const basePapers: PublicPaper[] = Array.from({ length: 4 }).map((_, i) => ({
        id: `tp-${teacherId}-${i}`,
        title: "Mathematics Fundamental Test",
        badges: i === 0 ? ["FEATURED"] : [],
        price: i === 1 ? 0 : 200, // One free
        purchased: i === 1, // The free one is "Purchased" (or maybe owned)
        level: i === 2 ? "Intermediate" : "Advanced",
        tags: ["Algebra", "Geometry", "Trigonometry"],
        rating: 4.5,
        questionCount: 35,
        durationMinutes: 60,
        attempts: 117,
        date: "29 Oct 2025",
        subject: "Mathematics",
        teacher: {
            id: teacherId,
            name: "Mrunal Sir",
            avatarUrl: "/assets/images/avatar-male-1.png"
        }
    }));

    let results = [...basePapers];

    if (subjectFilter) {
        // Mock filtering
    }

    // In a real app we'd filter by subject/difficulty. 
    // For this mock, we just return the generated list to populate the view.

    return results;
}
