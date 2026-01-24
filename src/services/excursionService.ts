import { Excursion } from "@/types/excursion";

// Mock Data separated from the UI logic
const MOCK_EXCURSIONS: Excursion[] = [
    {
        id: "1",
        companyName: "OLA Electric",
        industry: "Renewable Energy",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Ola_Cabs_logo.svg",
        dateBadge: "10th Jan 2pm",
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: 40,
        visits: 57,
        votes: 72,
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        statusType: "consent",
        statusValue: 21,
        statusTotal: 30,
        isApproved: true,
    },
    {
        id: "2",
        companyName: "Glenmark",
        industry: "Biotechnology",
        logoUrl: "",
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: 40,
        visits: 57,
        votes: 72,
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        statusType: "interest",
        statusValue: 75,
        highDemand: true,
        showConsentButton: true,
        dateBadge: "22nd Jan 2pm",
    },
    {
        id: "3",
        companyName: "Google",
        industry: "Software Company",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: 40,
        visits: 57,
        votes: 72,
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        statusType: "interest",
        statusValue: 75,
        highDemand: true,
    },
    {
        id: "4",
        companyName: "Adani Green",
        industry: "Renewable Energy",
        logoUrl: "",
        rating: 4.5,
        duration: "3 Hours",
        maxStudents: 40,
        visits: 57,
        votes: 72,
        location: "Krishnagiri, Tamil Nadu, India",
        description: "Pioneer in solar and wind energy solutions. Students will explore renewable energy technologies, sustainability practices, and environmental engineering.",
        tags: ["Solar Farm", "Wind Turbine Site", "Research Lab", "Control Room"],
        statusType: "interest",
        statusValue: 29,
        statusLabel: "Need 41% more vote",
    },
];

/**
 * Simulates a backend API service.
 * In production, this would use fetch/axios to call your real endpoints.
 */
export const excursionService = {
    getAll: async (): Promise<Excursion[]> => {
        // Simulate network delay (remove this in production)
        await new Promise((resolve) => setTimeout(resolve, 800));
        return MOCK_EXCURSIONS;
    },

    getById: async (id: string): Promise<Excursion | undefined> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_EXCURSIONS.find((e) => e.id === id);
    },
};
