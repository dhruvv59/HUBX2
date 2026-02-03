/**
 * Practice Papers Service
 * 
 * Handles all API interactions for practice papers
 * Production-ready with error handling, retries, and mock data fallback
 */

import { httpClient } from '@/lib/http-client';
import type {
    GetPapersParams,
    GetPapersResponse,
    GetPaperDetailsResponse,
    StartTestResponse,
    SubmitTestResponse,
    Paper,
    PaperStats,
    PaginationMeta,
    ITEMS_PER_PAGE
} from '@/types/practice-paper';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// API Endpoints
const ENDPOINTS = {
    getPapers: `${API_BASE_URL}/v1/practice-papers`,
    getPaper: (id: string) => `${API_BASE_URL}/v1/practice-papers/${id}`,
    startTest: (id: string) => `${API_BASE_URL}/v1/practice-papers/${id}/start`,
    submitTest: (id: string) => `${API_BASE_URL}/v1/practice-papers/${id}/submit`,
    getAttempt: (paperId: string, attemptId: string) => `${API_BASE_URL}/v1/practice-papers/${paperId}/attempts/${attemptId}`,
} as const;

// ============================================
// MOCK DATA GENERATOR
// ============================================

function generateMockPapers(count: number, offset: number = 0): Paper[] {
    const types: Array<'practice' | 'previous' | 'assigned'> = ['practice', 'previous', 'assigned'];
    const subjects = ['Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'];
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const statuses: Array<'not-started' | 'in-progress' | 'completed'> = ['not-started', 'in-progress', 'completed'];

    const paperTemplates = [
        // Physics
        { title: 'Thermodynamics Complete', subject: 'Physics', topic: 'Thermodynamics' },
        { title: 'Electricity & Magnetism', subject: 'Physics', topic: 'Electromagnetism' },
        { title: 'Optics Full Test', subject: 'Physics', topic: 'Optics' },
        { title: 'Mechanics Advanced', subject: 'Physics', topic: 'Mechanics' },
        { title: 'Modern Physics', subject: 'Physics', topic: 'Modern Physics' },

        // Mathematics
        { title: 'Complex Numbers Practice', subject: 'Mathematics', topic: 'Algebra' },
        { title: 'Trigonometry Advanced', subject: 'Mathematics', topic: 'Trigonometry' },
        { title: 'Calculus Complete', subject: 'Mathematics', topic: 'Calculus' },
        { title: 'Coordinate Geometry', subject: 'Mathematics', topic: 'Geometry' },
        { title: 'Probability & Statistics', subject: 'Mathematics', topic: 'Statistics' },

        // Chemistry
        { title: 'Organic Chemistry - Alcohols', subject: 'Chemistry', topic: 'Organic Chemistry' },
        { title: 'Chemical Bonding', subject: 'Chemistry', topic: 'Physical Chemistry' },
        { title: 'Periodic Table Quiz', subject: 'Chemistry', topic: 'Inorganic Chemistry' },
        { title: 'Electrochemistry', subject: 'Chemistry', topic: 'Physical Chemistry' },

        // Biology
        { title: 'Cell Biology', subject: 'Biology', topic: 'Cell Biology' },
        { title: 'Genetics & Evolution', subject: 'Biology', topic: 'Genetics' },
        { title: 'Human Physiology', subject: 'Biology', topic: 'Physiology' },

        // English
        { title: 'Grammar & Comprehension', subject: 'English', topic: 'Grammar' },
        { title: 'Literature Analysis', subject: 'English', topic: 'Literature' },
    ];

    const papers: Paper[] = [];

    for (let i = 0; i < count; i++) {
        const index = (offset + i) % paperTemplates.length;
        const template = paperTemplates[index];
        const type = types[i % types.length];
        const difficulty = difficulties[i % difficulties.length];
        const status = statuses[i % statuses.length];

        const baseQuestions = 20 + (i % 30);
        const baseDuration = 40 + (i % 60);
        const baseMarks = baseQuestions * 2;

        let paper: Paper = {
            id: `paper-${offset + i + 1}`,
            title: template.title,
            type,
            subject: template.subject,
            difficulty,
            questions: baseQuestions,
            duration: baseDuration,
            marks: baseMarks,
            status,
            attempts: status === 'not-started' ? 0 : (i % 3) + 1,
            createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
            updatedAt: new Date(Date.now() - (i * 86400000)).toISOString(),
        };

        // Add type-specific fields
        if (type === 'previous') {
            paper.year = 2024 - (i % 3);
            paper.title = `CBSE Board ${template.subject} ${paper.year}`;
        } else if (type === 'assigned') {
            const teachers = ['Dr. Bhagabati Das', 'Mrs. Sharma', 'Mr. Prasad', 'Dr. Kiran'];
            paper.assignedBy = teachers[i % teachers.length];
            paper.dueDate = new Date(Date.now() + ((i % 10) * 86400000)).toISOString();
            paper.title = `Test: ${template.title}`;
        }

        // Add completion data if completed
        if (status === 'completed') {
            const scorePercentage = 60 + (i % 35);
            paper.score = Math.floor((baseMarks * scorePercentage) / 100);
            paper.percentage = scorePercentage;
        }

        // Add last attempt date if not fresh
        if (status !== 'not-started') {
            paper.lastAttemptedAt = new Date(Date.now() - ((i % 7) * 86400000)).toISOString();
        }

        papers.push(paper);
    }

    return papers;
}

function getMockPapersResponse(params: GetPapersParams): GetPapersResponse {
    const {
        page = 1,
        limit = 9,
        subject = 'All',
        type = 'all',
        search = '',
    } = params;

    // Generate 50 total papers for pagination testing
    const allPapers = generateMockPapers(50);

    // Apply filters
    let filteredPapers = allPapers.filter(paper => {
        const matchesSubject = subject === 'All' || paper.subject === subject;
        const matchesType = type === 'all' || paper.type === type;
        const matchesSearch = !search || paper.title.toLowerCase().includes(search.toLowerCase());

        return matchesSubject && matchesType && matchesSearch;
    });

    // Calculate pagination
    const totalItems = filteredPapers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated papers
    const paginatedPapers = filteredPapers.slice(startIndex, endIndex);

    // Calculate stats
    const stats: PaperStats = {
        total: totalItems,
        completed: filteredPapers.filter(p => p.status === 'completed').length,
        inProgress: filteredPapers.filter(p => p.status === 'in-progress').length,
        notStarted: filteredPapers.filter(p => p.status === 'not-started').length,
        assigned: filteredPapers.filter(p => p.type === 'assigned' && p.status !== 'completed').length,
        averageScore: calculateAverageScore(filteredPapers),
    };

    const pagination: PaginationMeta = {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };

    return {
        success: true,
        data: {
            papers: paginatedPapers,
            stats,
            pagination,
        },
        timestamp: new Date().toISOString(),
    };
}

function calculateAverageScore(papers: Paper[]): number {
    const completedPapers = papers.filter(p => p.status === 'completed' && p.percentage);
    if (completedPapers.length === 0) return 0;

    const totalPercentage = completedPapers.reduce((sum, p) => sum + (p.percentage || 0), 0);
    return Math.round(totalPercentage / completedPapers.length);
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * Get paginated papers with filters
 * 
 * @example
 * const response = await getPapers({ page: 1, limit: 9, subject: 'Physics' });
 */
export async function getPapers(params: GetPapersParams = {}): Promise<GetPapersResponse> {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockPapersResponse(params);
    }

    try {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });

        const response = await httpClient.get<GetPapersResponse>(
            `${ENDPOINTS.getPapers}?${queryParams.toString()}`
        );

        return response;
    } catch (error) {
        console.error('Error fetching papers:', error);
        throw error;
    }
}

/**
 * Get single paper details
 */
export async function getPaperById(id: string): Promise<GetPaperDetailsResponse> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const allPapers = generateMockPapers(50);
        const paper = allPapers.find(p => p.id === id);

        if (!paper) {
            throw new Error('Paper not found');
        }

        return {
            success: true,
            data: { paper },
            timestamp: new Date().toISOString(),
        };
    }

    try {
        const response = await httpClient.get<GetPaperDetailsResponse>(
            ENDPOINTS.getPaper(id)
        );
        return response;
    } catch (error) {
        console.error('Error fetching paper:', error);
        throw error;
    }
}

/**
 * Start a test
 */
export async function startTest(paperId: string): Promise<StartTestResponse> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            data: {
                attemptId: `attempt-${Date.now()}`,
                startedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
                questions: [], // Would include actual questions
            },
            timestamp: new Date().toISOString(),
        };
    }

    try {
        const response = await httpClient.post<StartTestResponse>(
            ENDPOINTS.startTest(paperId),
            { paperId }
        );
        return response;
    } catch (error) {
        console.error('Error starting test:', error);
        throw error;
    }
}

/**
 * Submit test answers
 */
export async function submitTest(
    paperId: string,
    attemptId: string,
    answers: any[]
): Promise<SubmitTestResponse> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalMarks = 100;
        const score = Math.floor(Math.random() * 40) + 60; // 60-100

        return {
            success: true,
            data: {
                score,
                totalMarks,
                percentage: score,
                correctAnswers: Math.floor(answers.length * 0.7),
                incorrectAnswers: Math.floor(answers.length * 0.2),
                unanswered: Math.floor(answers.length * 0.1),
                timeTaken: 3600,
                rank: Math.floor(Math.random() * 50) + 1,
                feedback: 'Great job! Keep practicing.',
            },
            timestamp: new Date().toISOString(),
        };
    }

    try {
        const response = await httpClient.post<SubmitTestResponse>(
            ENDPOINTS.submitTest(paperId),
            { attemptId, answers }
        );
        return response;
    } catch (error) {
        console.error('Error submitting test:', error);
        throw error;
    }
}

// ============================================
// EXPORT
// ============================================

export const practicePaperService = {
    getPapers,
    getPaperById,
    startTest,
    submitTest,
};
