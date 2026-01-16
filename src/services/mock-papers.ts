
// --- MOCK DATA ---
import { Paper } from "@/components/teacher/papers/TeacherPaperCard";

export const MOCK_PAPERS: Paper[] = [
    {
        id: "p1",
        title: "Mathematics Fundamental Test",
        badges: ["Advanced", "Algebra", "Geometry", "Trigonometry"],
        standard: "9th",
        price: 200,
        rating: 4.5,
        questions: 35,
        duration: "60 mins",
        attempts: 117,
        date: "29 Oct 2025",
        idTag: 159,
        teacher: { name: "Mrunal Sir", avatar: "/assets/images/avatar-male-1.png" },
        isTrending: true
    },
    {
        id: "p2",
        title: "Mathematics Fundamental Test",
        badges: ["Beginner", "Algebra", "Geometry", "Trigonometry"],
        standard: "9th",
        price: 99,
        rating: 4.5,
        questions: 35,
        duration: "60 mins",
        attempts: 117,
        date: "29 Oct 2025",
        idTag: 159,
        teacher: { name: "Mrunal Sir", avatar: "/assets/images/avatar-male-1.png" },
        isTrending: false
    },
    {
        id: "p3",
        title: "Mathematics Fundamental Test",
        badges: ["Intermediate", "Algebra", "Geometry", "Trigonometry"],
        standard: "9th",
        price: 120,
        rating: 4.5,
        questions: 35,
        duration: "60 mins",
        attempts: 117,
        date: "29 Oct 2025",
        idTag: 159,
        teacher: { name: "Mrunal Sir", avatar: "/assets/images/avatar-male-1.png" },
        isTrending: false
    },
    {
        id: "p4",
        title: "Mathematics Fundamental Test",
        badges: ["Advanced", "Algebra", "Geometry", "Trigonometry"],
        standard: "9th",
        price: 140,
        rating: 4.5,
        questions: 35,
        duration: "60 mins",
        attempts: 117,
        date: "29 Oct 2025",
        idTag: 159,
        teacher: { name: "Mrunal Sir", avatar: "/assets/images/avatar-male-1.png" },
        isTrending: true
    },
];
