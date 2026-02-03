/**
 * HTTP Client Utility
 * Production-ready HTTP client with error handling, retries, and interceptors
 */

import { API_CONFIG } from './api-config';

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class NetworkError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'NetworkError';
    }
}

interface RequestOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

/**
 * Main HTTP client with retry logic and error handling
 */
export async function apiClient<T>(
    url: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        timeout = API_CONFIG.timeout,
        retries = API_CONFIG.retries,
        retryDelay = API_CONFIG.retryDelay,
        ...fetchOptions
    } = options;

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchOptions.headers,
                },
            });

            clearTimeout(timeoutId);

            // Handle HTTP errors
            if (!response.ok) {
                let errorData: any = {};
                try {
                    errorData = await response.json();
                } catch {
                    // Response is not JSON
                }

                throw new ApiError(
                    errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    errorData.code,
                    errorData.details
                );
            }

            // Parse successful response
            const data = await response.json();
            return data as T;

        } catch (error: any) {
            lastError = error;

            // Don't retry on client errors (4xx)
            if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
                throw error;
            }

            // Don't retry on the last attempt
            if (attempt === retries) {
                break;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
    }

    // All retries failed
    if (lastError) {
        if (lastError instanceof ApiError) {
            throw lastError;
        }
        throw new NetworkError('Failed to fetch data after multiple retries', lastError);
    }

    throw new NetworkError('Unknown error occurred');
}

/**
 * Convenience methods
 */
export const http = {
    get: <T>(url: string, options?: RequestOptions) =>
        apiClient<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, body?: any, options?: RequestOptions) =>
        apiClient<T>(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(url: string, body?: any, options?: RequestOptions) =>
        apiClient<T>(url, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(url: string, options?: RequestOptions) =>
        apiClient<T>(url, { ...options, method: 'DELETE' }),

    patch: <T>(url: string, body?: any, options?: RequestOptions) =>
        apiClient<T>(url, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),
};
