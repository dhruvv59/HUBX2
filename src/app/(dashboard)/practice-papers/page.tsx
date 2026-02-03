"use client";

/**
 * Practice Papers Page - Production Grade
 * 
 * Features:
 * - Dynamic data from API
 * - Pagination with page numbers
 * - Subject and type filtering
 * - Real-time search
 * - Loading, error, and empty states
 * - Responsive design
 * 
 * Backend Integration:
 * - GET /api/v1/practice-papers with pagination
 * - Supports filtering and search
 * - Mock data fallback for development
 */

import React, { useState, useEffect, useCallback } from "react";
import {
    BookOpen,
    Clock,
    Trophy,
    Search,
    ChevronRight,
    ChevronLeft,
    FileText,
    Calendar,
    Target,
    CheckCircle,
    AlertCircle,
    Play,
    Eye,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { practicePaperService } from "@/services/practice-paper";
import type {
    Paper,
    PaperStats,
    PaginationMeta,
    PaperFilters,
    GetPapersParams,
    PaperType
} from "@/types/practice-paper";

const SUBJECTS = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'];
const ITEMS_PER_PAGE = 9;

export default function PracticePapersPage() {
    // State Management
    const [papers, setPapers] = useState<Paper[]>([]);
    const [stats, setStats] = useState<PaperStats>({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        assigned: 0,
    });
    const [pagination, setPagination] = useState<PaginationMeta>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Filter State
    const [filters, setFilters] = useState<PaperFilters>({
        subject: 'All',
        type: 'all',
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Papers
    const fetchPapers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params: GetPapersParams = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                subject: filters.subject !== 'All' ? filters.subject : undefined,
                type: filters.type !== 'all' ? filters.type : undefined,
                search: filters.search || undefined,
            };

            const response = await practicePaperService.getPapers(params);

            if (response.success) {
                setPapers(response.data.papers);
                setStats(response.data.stats);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching papers:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, filters]);

    // Fetch on mount and when filters/page change
    useEffect(() => {
        fetchPapers();
    }, [fetchPapers]);

    // Filter Handlers
    const handleSubjectChange = (subject: string) => {
        setFilters(prev => ({ ...prev, subject }));
        setCurrentPage(1); // Reset to page 1 when filtering
    };

    const handleTypeChange = (type: PaperType | 'all') => {
        setFilters(prev => ({ ...prev, type }));
        setCurrentPage(1);
    };

    const handleSearchChange = (search: string) => {
        setFilters(prev => ({ ...prev, search }));
        setCurrentPage(1);
    };

    // Pagination Handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        Practice Papers
                    </h1>
                    <p className="text-gray-500 mt-2 text-base font-medium">
                        Master your subjects with practice tests and previous year papers
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium">In Progress</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search papers..."
                            value={filters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Type Filter Tabs */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                        {(['all', 'assigned', 'previous', 'practice'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTypeChange(tab)}
                                disabled={isLoading}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                    filters.type === tab
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900",
                                    isLoading && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject Pills */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {SUBJECTS.map((subject) => (
                        <button
                            key={subject}
                            onClick={() => handleSubjectChange(subject)}
                            disabled={isLoading}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                                filters.subject === subject
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Loading papers...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to load papers</h3>
                    <p className="text-red-700 mb-4">{error.message}</p>
                    <button
                        onClick={fetchPapers}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Papers Grid */}
            {!isLoading && !error && (
                <>
                    {papers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {papers.map((paper) => (
                                <PaperCard key={paper.id} paper={paper} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No papers found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search query</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            hasNextPage={pagination.hasNextPage}
                            hasPrevPage={pagination.hasPrevPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}

// ============================================
// PAPER CARD COMPONENT
// ============================================

function PaperCard({ paper }: { paper: Paper }) {
    const typeConfig = {
        practice: {
            label: 'Practice',
            color: 'bg-blue-50 text-blue-600 border-blue-200',
            icon: BookOpen
        },
        previous: {
            label: `Previous ${paper.year}`,
            color: 'bg-purple-50 text-purple-600 border-purple-200',
            icon: Calendar
        },
        assigned: {
            label: 'Assigned Test',
            color: 'bg-orange-50 text-orange-600 border-orange-200',
            icon: Target
        }
    };

    const difficultyConfig = {
        easy: 'bg-green-50 text-green-700',
        medium: 'bg-yellow-50 text-yellow-700',
        hard: 'bg-red-50 text-red-700'
    };

    const statusConfig = {
        'not-started': {
            label: 'Start Test',
            icon: Play,
            color: 'bg-blue-600 hover:bg-blue-700 text-white'
        },
        'in-progress': {
            label: 'Continue',
            icon: ChevronRight,
            color: 'bg-orange-600 hover:bg-orange-700 text-white'
        },
        'completed': {
            label: 'Review',
            icon: Eye,
            color: 'bg-green-600 hover:bg-green-700 text-white'
        }
    };

    const config = typeConfig[paper.type];
    const StatusIcon = statusConfig[paper.status].icon;
    const TypeIcon = config.icon;

    // Format dates
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatRelativeTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return formatDate(dateString);
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
                    config.color
                )}>
                    <TypeIcon className="h-3.5 w-3.5" />
                    {config.label}
                </div>
                <span className={cn(
                    "px-2 py-1 rounded-lg text-xs font-bold uppercase",
                    difficultyConfig[paper.difficulty]
                )}>
                    {paper.difficulty}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
                {paper.title}
            </h3>

            {/* Subject */}
            <p className="text-sm font-medium text-gray-500 mb-4">{paper.subject}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center py-2 bg-gray-50 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-gray-900">{paper.questions}</p>
                    <p className="text-[10px] text-gray-500">Questions</p>
                </div>
                <div className="text-center py-2 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-gray-900">{paper.duration}m</p>
                    <p className="text-[10px] text-gray-500">Duration</p>
                </div>
                <div className="text-center py-2 bg-gray-50 rounded-lg">
                    <Trophy className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-gray-900">{paper.marks}</p>
                    <p className="text-[10px] text-gray-500">Marks</p>
                </div>
            </div>

            {/* Score/Status */}
            {paper.status === 'completed' && paper.score !== undefined && (
                <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-900">Completed</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                            {paper.percentage}%
                        </span>
                    </div>
                </div>
            )}

            {/* Assigned Test Info */}
            {paper.type === 'assigned' && paper.dueDate && paper.status !== 'completed' && (
                <div className="mb-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-semibold text-orange-900">Due: {formatDate(paper.dueDate)}</span>
                    </div>
                    <p className="text-xs text-orange-700">Assigned by: {paper.assignedBy}</p>
                </div>
            )}

            {/* Attempts */}
            {paper.attempts > 0 && (
                <p className="text-xs text-gray-500 mb-4">
                    {paper.attempts} attempt{paper.attempts > 1 ? 's' : ''}
                    {paper.lastAttemptedAt && ` • Last: ${formatRelativeTime(paper.lastAttemptedAt)}`}
                </p>
            )}

            {/* Action Button */}
            <button className={cn(
                "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg",
                statusConfig[paper.status].color
            )}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig[paper.status].label}
            </button>
        </div>
    );
}

// ============================================
// PAGINATION COMPONENT
// ============================================

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage, onPageChange }: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show with ellipsis
            if (currentPage <= 3) {
                // Near start
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near end
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                // Middle
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className={cn(
                    "px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all",
                    hasPrevPage
                        ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={cn(
                                "px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                                currentPage === page
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className={cn(
                    "px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all",
                    hasNextPage
                        ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
