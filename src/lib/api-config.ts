/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base API URL - should be set via environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Dashboard API Endpoints
 */
export const DASHBOARD_ENDPOINTS = {
    // Main dashboard data endpoint
    getDashboard: () => `${API_BASE_URL}/v1/dashboard`,

    // Individual widget endpoints (for future optimization)
    getStats: () => `${API_BASE_URL}/v1/dashboard/stats`,
    getPerformance: () => `${API_BASE_URL}/v1/dashboard/performance`,
    getUpcomingExams: () => `${API_BASE_URL}/v1/dashboard/upcoming-exams`,
    getRecentActivity: () => `${API_BASE_URL}/v1/dashboard/recent-activity`,
    getSyllabusCoverage: () => `${API_BASE_URL}/v1/dashboard/syllabus`,
    getTestRecommendations: () => `${API_BASE_URL}/v1/dashboard/test-recommendations`,
    getPeerRank: () => `${API_BASE_URL}/v1/dashboard/peer-rank`,
} as const;

/**
 * API Client Configuration
 */
export const API_CONFIG = {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
} as const;
