/**
 * Notification Service
 * 
 * Production-ready service layer for notification management.
 * Handles all API communication for notifications.
 * 
 * @module services/notification
 */

import { http, ApiError, NetworkError } from '@/lib/http-client';
import { API_BASE_URL } from '@/lib/api-config';
import type {
    Notification,
    NotificationFilters,
    NotificationPreferences,
    NotificationStats,
    GetNotificationsResponse,
    MarkAsReadResponse,
    BulkActionResponse,
} from '@/types/notification';

/**
 * API Endpoints
 */
const ENDPOINTS = {
    getNotifications: (params?: string) =>
        `${API_BASE_URL}/v1/notifications${params ? `?${params}` : ''}`,
    getNotification: (id: string) =>
        `${API_BASE_URL}/v1/notifications/${id}`,
    markAsRead: (id: string) =>
        `${API_BASE_URL}/v1/notifications/${id}/read`,
    markAllAsRead: () =>
        `${API_BASE_URL}/v1/notifications/read-all`,
    deleteNotification: (id: string) =>
        `${API_BASE_URL}/v1/notifications/${id}`,
    archiveNotification: (id: string) =>
        `${API_BASE_URL}/v1/notifications/${id}/archive`,
    getStats: () =>
        `${API_BASE_URL}/v1/notifications/stats`,
    getPreferences: () =>
        `${API_BASE_URL}/v1/notifications/preferences`,
    updatePreferences: () =>
        `${API_BASE_URL}/v1/notifications/preferences`,
} as const;

/**
 * Feature flag for mock data
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * ============================================
 * MOCK DATA (Development/Testing)
 * ============================================
 */
/**
 * Production-Realistic Mock Notifications
 * 
 * These demonstrate real-world teacher-to-student notification flows:
 * - Teacher assigns homework → Student gets notification
 * - Teacher grades work → Student gets feedback notification
 * - Teacher posts announcement → Class gets notified
 * - System sends test reminders → Students get reminded
 * - Student achieves milestone → Achievement unlocked
 * - Deadline approaching → Urgent reminder
 */
function getMockNotifications(): Notification[] {
    const now = Date.now();

    return [
        // ==========================================
        // SCENARIO 1: Teacher Assigns New Homework
        // ==========================================
        {
            id: 'notif-001',
            userId: 'student-123',
            title: 'New Assignment: Thermodynamics Chapter 5',
            message: 'Dr. Bhagabati Das assigned you "Heat Transfer Problems Set". Due: Feb 7, 2026 at 11:59 PM. This covers topics from Chapter 5 including conduction, convection, and radiation.',
            type: 'assignment',
            priority: 'high',
            isRead: false,
            isArchived: false,
            createdAt: new Date(now - 5 * 60 * 1000).toISOString(), // 5 minutes ago
            avatar: '/assets/images/teacher1.png',
            action: {
                type: 'navigate',
                url: '/assignments/thermo-ch5-hw',
                metadata: {
                    assignmentId: 'thermo-ch5-hw',
                    dueDate: '2026-02-07T23:59:00Z'
                }
            },
            metadata: {
                authorId: 'teacher-001',
                authorName: 'Dr. Bhagabati Das',
                authorRole: 'Physics Teacher',
                relatedEntityId: 'thermo-ch5-hw',
                relatedEntityType: 'assignment',
                tags: ['physics', 'thermodynamics', 'homework']
            }
        },

        // ==========================================
        // SCENARIO 2: Urgent Test Reminder
        // ==========================================
        {
            id: 'notif-002',
            userId: 'student-123',
            title: '⏰ Test Starting Soon!',
            message: 'Your Mathematics Full Mock Test starts in 1 hour 45 minutes. Topics: Algebra, Trigonometry, Calculus. Duration: 90 minutes. Make sure you have your calculator ready!',
            type: 'test',
            priority: 'urgent',
            isRead: false,
            isArchived: false,
            createdAt: new Date(now - 15 * 60 * 1000).toISOString(), // 15 minutes ago
            action: {
                type: 'navigate',
                url: '/assessments/math-mock-feb-2026',
                metadata: {
                    testId: 'math-mock-feb-2026',
                    startTime: new Date(now + 105 * 60 * 1000).toISOString(),
                    duration: 90
                }
            },
            metadata: {
                relatedEntityId: 'math-mock-feb-2026',
                relatedEntityType: 'test',
                tags: ['mathematics', 'mock-test', 'urgent'],
                testSubjects: ['Algebra', 'Trigonometry', 'Calculus']
            }
        },

        // ==========================================
        // SCENARIO 3: Teacher Posted Feedback
        // ==========================================
        {
            id: 'notif-003',
            userId: 'student-123',
            title: 'Feedback Received: English Essay',
            message: 'Ms. Romana Khan reviewed your essay "Impact of Technology on Society". Score: 88/100. Great work! Check detailed comments and suggestions for improvement.',
            type: 'feedback',
            priority: 'medium',
            isRead: false,
            isArchived: false,
            createdAt: new Date(now - 45 * 60 * 1000).toISOString(), // 45 minutes ago
            avatar: '/assets/images/teacher2.png',
            action: {
                type: 'navigate',
                url: '/submissions/essay-tech-society/feedback',
                metadata: {
                    submissionId: 'essay-tech-society',
                    score: 88,
                    maxScore: 100
                }
            },
            metadata: {
                authorId: 'teacher-002',
                authorName: 'Romana Khan',
                authorRole: 'English Teacher',
                relatedEntityId: 'essay-tech-society',
                relatedEntityType: 'submission',
                tags: ['english', 'essay', 'feedback', 'graded'],
                grade: '88/100'
            }
        },

        // ==========================================
        // SCENARIO 4: Class Announcement from Teacher
        // ==========================================
        {
            id: 'notif-004',
            userId: 'student-123',
            title: '📢 Important: Class Location Changed',
            message: 'Mr. Prasad Harichandan: Tomorrow\'s Social Science class (Feb 4) will be held in Computer Lab 2 instead of Room 205. We\'ll be doing a multimedia presentation on Indian History.',
            type: 'announcement',
            priority: 'medium',
            isRead: false,
            isArchived: false,
            createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            avatar: '/assets/images/teacher3.png',
            action: {
                type: 'navigate',
                url: '/announcements/class-location-feb4'
            },
            metadata: {
                authorId: 'teacher-003',
                authorName: 'Prasad Harichandan',
                authorRole: 'Social Science Teacher',
                relatedEntityId: 'class-location-feb4',
                relatedEntityType: 'announcement',
                tags: ['announcement', 'schedule-change', 'social-science'],
                affectedDate: '2026-02-04',
                newLocation: 'Computer Lab 2',
                oldLocation: 'Room 205'
            }
        },

        // ==========================================
        // SCENARIO 5: Achievement Unlocked (Gamification)
        // ==========================================
        {
            id: 'notif-005',
            userId: 'student-123',
            title: '🏆 Achievement Unlocked: Consistent Learner',
            message: 'Congratulations! You\'ve maintained a 7-day learning streak. You\'re in the top 10% of your class. Keep up the excellent work to unlock the "Study Champion" badge!',
            type: 'achievement',
            priority: 'low',
            isRead: false,
            isArchived: false,
            createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            action: {
                type: 'navigate',
                url: '/achievements',
                metadata: {
                    achievementId: 'consistent-learner',
                    streakDays: 7,
                    nextMilestone: 14
                }
            },
            metadata: {
                relatedEntityType: 'achievement',
                tags: ['achievement', 'streak', 'milestone', 'gamification'],
                streakDays: 7,
                percentile: 90,
                nextBadge: 'Study Champion',
                nextMilestone: '14 days'
            }
        },

        // ==========================================
        // SCENARIO 6: Teacher Graded Recent Test
        // ==========================================
        {
            id: 'notif-006',
            userId: 'student-123',
            title: 'Test Results: Chemistry Chapter 3 Quiz',
            message: 'Dr. Kiran Kumari has published results for "Periodic Table Quiz". Your score: 42/50 (84%). Class average: 78%. Great job! Review your mistakes to improve further.',
            type: 'test',
            priority: 'medium',
            isRead: true,
            isArchived: false,
            createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
            readAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
            avatar: '/assets/images/teacher4.png',
            action: {
                type: 'navigate',
                url: '/tests/chemistry-periodic-table/results',
                metadata: {
                    testId: 'chemistry-periodic-table',
                    score: 42,
                    maxScore: 50,
                    percentage: 84
                }
            },
            metadata: {
                authorId: 'teacher-004',
                authorName: 'Dr. Kiran Kumari',
                authorRole: 'Chemistry Teacher',
                relatedEntityId: 'chemistry-periodic-table',
                relatedEntityType: 'test',
                tags: ['chemistry', 'quiz', 'results', 'graded'],
                score: '42/50',
                percentage: 84,
                classAverage: 78
            }
        },

        // ==========================================
        // SCENARIO 7: Assignment Deadline Reminder
        // ==========================================
        {
            id: 'notif-007',
            userId: 'student-123',
            title: '⚠️ Assignment Due Tomorrow',
            message: 'Reminder: "Geography Map Project" assigned by Mrs. Jyoti Sharma is due tomorrow at 11:59 PM. You haven\'t submitted yet. Don\'t miss the deadline!',
            type: 'reminder',
            priority: 'high',
            isRead: true,
            isArchived: false,
            createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
            readAt: new Date(now - 7 * 60 * 60 * 1000).toISOString(),
            action: {
                type: 'navigate',
                url: '/assignments/geography-map-project',
                metadata: {
                    assignmentId: 'geography-map-project',
                    dueDate: new Date(now + 16 * 60 * 60 * 1000).toISOString(),
                    submitted: false
                }
            },
            metadata: {
                authorName: 'System',
                authorRole: 'Automated Reminder',
                relatedEntityId: 'geography-map-project',
                relatedEntityType: 'assignment',
                tags: ['reminder', 'deadline', 'geography', 'urgent'],
                dueIn: '16 hours',
                submitted: false,
                assignedBy: 'Mrs. Jyoti Sharma'
            }
        },

        // ==========================================
        // SCENARIO 8: Teacher Added Study Material
        // ==========================================
        {
            id: 'notif-008',
            userId: 'student-123',
            title: 'New Study Material: Biology Notes',
            message: 'Dr. Bhagabati Das uploaded "Cell Structure & Functions - Detailed Notes" with diagrams and practice questions. Review before tomorrow\'s class discussion.',
            type: 'announcement',
            priority: 'low',
            isRead: true,
            isArchived: false,
            createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
            readAt: new Date(now - 20 * 60 * 60 * 1000).toISOString(),
            avatar: '/assets/images/teacher1.png',
            action: {
                type: 'navigate',
                url: '/materials/biology-cell-structure',
                metadata: {
                    materialId: 'biology-cell-structure',
                    fileType: 'PDF',
                    pages: 15
                }
            },
            metadata: {
                authorId: 'teacher-001',
                authorName: 'Dr. Bhagabati Das',
                authorRole: 'Biology Teacher',
                relatedEntityId: 'biology-cell-structure',
                relatedEntityType: 'study-material',
                tags: ['biology', 'study-material', 'notes'],
                fileType: 'PDF',
                pages: 15
            }
        },

        // ==========================================
        // SCENARIO 9: Peer Collaboration Invitation
        // ==========================================
        {
            id: 'notif-009',
            userId: 'student-123',
            title: 'Study Group Invitation',
            message: 'Rahul Verma invited you to join "Mathematics Problem Solving" study group. 5 members already joined. Next session: Tomorrow 4:00 PM.',
            type: 'announcement',
            priority: 'low',
            isRead: true,
            isArchived: false,
            createdAt: new Date(now - 30 * 60 * 60 * 1000).toISOString(), // Yesterday
            readAt: new Date(now - 28 * 60 * 60 * 1000).toISOString(),
            action: {
                type: 'navigate',
                url: '/study-groups/math-problem-solving',
                metadata: {
                    groupId: 'math-problem-solving',
                    memberCount: 5,
                    nextSession: new Date(now + 20 * 60 * 60 * 1000).toISOString()
                }
            },
            metadata: {
                authorName: 'Rahul Verma',
                authorRole: 'Student',
                relatedEntityId: 'math-problem-solving',
                relatedEntityType: 'study-group',
                tags: ['collaboration', 'study-group', 'mathematics'],
                memberCount: 5,
                invitedBy: 'Rahul Verma'
            }
        },

        // ==========================================
        // SCENARIO 10: System Notification
        // ==========================================
        {
            id: 'notif-010',
            userId: 'student-123',
            title: 'Profile Completion Reminder',
            message: 'Your profile is 75% complete. Add your emergency contact and preferences to unlock personalized study recommendations.',
            type: 'system',
            priority: 'low',
            isRead: true,
            isArchived: false,
            createdAt: new Date(now - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
            readAt: new Date(now - 47 * 60 * 60 * 1000).toISOString(),
            action: {
                type: 'navigate',
                url: '/profile/edit',
                metadata: {
                    completionPercentage: 75,
                    missingFields: ['emergency_contact', 'study_preferences']
                }
            },
            metadata: {
                authorName: 'System',
                authorRole: 'Automated',
                relatedEntityType: 'profile',
                tags: ['system', 'profile', 'reminder'],
                completionPercentage: 75
            }
        }
    ];
}

function getMockStats(): NotificationStats {
    const notifications = getMockNotifications();
    const unreadNotifications = notifications.filter(n => !n.isRead);

    // Count notifications by type
    const byType: Record<string, number> = {
        assignment: 0,
        test: 0,
        achievement: 0,
        feedback: 0,
        announcement: 0,
        reminder: 0,
        system: 0
    };

    // Count notifications by priority
    const byPriority: Record<string, number> = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
    };

    // Calculate counts
    notifications.forEach(n => {
        byType[n.type] = (byType[n.type] || 0) + 1;
        byPriority[n.priority] = (byPriority[n.priority] || 0) + 1;
    });

    // Count notifications from today and this week
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const todayCount = notifications.filter(n =>
        new Date(n.createdAt).getTime() > oneDayAgo
    ).length;

    const weekCount = notifications.filter(n =>
        new Date(n.createdAt).getTime() > oneWeekAgo
    ).length;

    return {
        total: notifications.length,
        unread: unreadNotifications.length,
        byType: byType as any,
        byPriority: byPriority as any,
        todayCount,
        weekCount
    };
}

/**
 * ============================================
 * PUBLIC API - SERVICE FUNCTIONS
 * ============================================
 */

/**
 * Get notifications with optional filters
 * 
 * @param filters - Optional filters to apply
 * @param cursor - Pagination cursor
 * @returns Promise<GetNotificationsResponse>
 * 
 * @example
 * const result = await getNotifications({ isRead: false, types: ['assignment'] });
 */
export async function getNotifications(
    filters?: NotificationFilters,
    cursor?: string
): Promise<GetNotificationsResponse> {
    if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let notifications = getMockNotifications();

        // Apply filters
        if (filters?.isRead !== undefined) {
            notifications = notifications.filter(n => n.isRead === filters.isRead);
        }
        if (filters?.types?.length) {
            notifications = notifications.filter(n => filters.types!.includes(n.type));
        }
        if (filters?.priorities?.length) {
            notifications = notifications.filter(n => filters.priorities!.includes(n.priority));
        }
        if (filters?.search) {
            const search = filters.search.toLowerCase();
            notifications = notifications.filter(n =>
                n.title.toLowerCase().includes(search) ||
                n.message.toLowerCase().includes(search)
            );
        }

        return {
            notifications,
            stats: getMockStats(),
            hasMore: false,
            nextCursor: undefined
        };
    }

    // Production API call
    try {
        const params = new URLSearchParams();

        if (filters?.isRead !== undefined) params.append('isRead', String(filters.isRead));
        if (filters?.isArchived !== undefined) params.append('isArchived', String(filters.isArchived));
        if (filters?.types?.length) params.append('types', filters.types.join(','));
        if (filters?.priorities?.length) params.append('priorities', filters.priorities.join(','));
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo) params.append('dateTo', filters.dateTo);
        if (filters?.search) params.append('search', filters.search);
        if (cursor) params.append('cursor', cursor);

        const response = await http.get<GetNotificationsResponse>(
            ENDPOINTS.getNotifications(params.toString())
        );

        return response;
    } catch (error) {
        console.error('[Notification Service] Failed to fetch notifications:', error);
        throw error;
    }
}

/**
 * Mark a notification as read
 * 
 * @param id - Notification ID
 * @returns Promise<MarkAsReadResponse>
 */
export async function markNotificationAsRead(id: string): Promise<MarkAsReadResponse> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const notifications = getMockNotifications();
        const notification = notifications.find(n => n.id === id);
        if (!notification) throw new Error('Notification not found');

        return {
            success: true,
            notification: { ...notification, isRead: true, readAt: new Date().toISOString() }
        };
    }

    try {
        const response = await http.patch<MarkAsReadResponse>(
            ENDPOINTS.markAsRead(id)
        );
        return response;
    } catch (error) {
        console.error(`[Notification Service] Failed to mark notification ${id} as read:`, error);
        throw error;
    }
}

/**
 * Mark all notifications as read
 * 
 * @returns Promise<BulkActionResponse>
 */
export async function markAllNotificationsAsRead(): Promise<BulkActionResponse> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const unreadCount = getMockNotifications().filter(n => !n.isRead).length;
        return {
            success: true,
            affectedCount: unreadCount
        };
    }

    try {
        const response = await http.post<BulkActionResponse>(
            ENDPOINTS.markAllAsRead()
        );
        return response;
    } catch (error) {
        console.error('[Notification Service] Failed to mark all notifications as read:', error);
        throw error;
    }
}

/**
 * Delete a notification
 * 
 * @param id - Notification ID
 * @returns Promise<{ success: boolean }>
 */
export async function deleteNotification(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true };
    }

    try {
        await http.delete(ENDPOINTS.deleteNotification(id));
        return { success: true };
    } catch (error) {
        console.error(`[Notification Service] Failed to delete notification ${id}:`, error);
        throw error;
    }
}

/**
 * Archive a notification
 * 
 * @param id - Notification ID
 * @returns Promise<{ success: boolean }>
 */
export async function archiveNotification(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true };
    }

    try {
        await http.patch(ENDPOINTS.archiveNotification(id));
        return { success: true };
    } catch (error) {
        console.error(`[Notification Service] Failed to archive notification ${id}:`, error);
        throw error;
    }
}

/**
 * Get notification statistics
 * 
 * @returns Promise<NotificationStats>
 */
export async function getNotificationStats(): Promise<NotificationStats> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return getMockStats();
    }

    try {
        const response = await http.get<NotificationStats>(
            ENDPOINTS.getStats()
        );
        return response;
    } catch (error) {
        console.error('[Notification Service] Failed to fetch notification stats:', error);
        throw error;
    }
}

/**
 * Get user notification preferences
 * 
 * @returns Promise<NotificationPreferences>
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            userId: 'student-123',
            email: {
                enabled: true,
                types: ['assignment', 'test', 'feedback'],
                frequency: 'instant'
            },
            push: {
                enabled: true,
                types: ['assignment', 'test', 'announcement']
            },
            inApp: {
                enabled: true,
                types: ['assignment', 'test', 'achievement', 'feedback', 'announcement', 'reminder', 'system']
            },
            soundEnabled: true,
            desktopNotifications: true
        };
    }

    try {
        const response = await http.get<NotificationPreferences>(
            ENDPOINTS.getPreferences()
        );
        return response;
    } catch (error) {
        console.error('[Notification Service] Failed to fetch notification preferences:', error);
        throw error;
    }
}

/**
 * Update user notification preferences
 * 
 * @param preferences - Updated preferences
 * @returns Promise<NotificationPreferences>
 */
export async function updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return preferences as NotificationPreferences;
    }

    try {
        const response = await http.put<NotificationPreferences>(
            ENDPOINTS.updatePreferences(),
            preferences
        );
        return response;
    } catch (error) {
        console.error('[Notification Service] Failed to update notification preferences:', error);
        throw error;
    }
}
