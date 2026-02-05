"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeft, Search, SlidersHorizontal, ChevronDown, Filter } from "lucide-react";
import { FilterSidebar } from "@/components/teacher/papers/FilterSidebar";
import { MobileFilterSidebar } from "@/components/teacher/papers/MobileFilterSidebar";
import { TeacherPaperCard } from "@/components/teacher/papers/TeacherPaperCard";
import { MOCK_PAPERS } from "@/services/mock-papers";

// Helper to duplicate mock data for pagination demo
const EXTENDED_MOCK_PAPERS = Array.from({ length: 99 }).map((_, i) => ({
    ...MOCK_PAPERS[i % MOCK_PAPERS.length],
    id: `p${i + 1}`,
    title: `${MOCK_PAPERS[i % MOCK_PAPERS.length].title} ${i + 1}`,
    price: Math.floor(Math.random() * 500) + 50,
    rating: (Math.random() * 2) + 3, // Random rating 3.0-5.0
    questions: Math.floor(Math.random() * 50) + 10,
    standard: ["8th", "9th", "10th"][i % 3], // Randomize standard
    badges: i % 2 === 0 ? ["Advanced", "Algebra"] : ["Beginner", "Geometry"] // Randomize badges for filtering test
}));

export default function PublicPapersPage() {
    // 1. Set default filters to "All"
    const [filters, setFilters] = useState({
        subject: "All",
        standard: "All",
        difficulty: "All",
        rating: "All",
        search: ""
    });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    // 2. Client-side filtering logic
    const filteredPapers = useMemo(() => {
        return EXTENDED_MOCK_PAPERS.filter(paper => {
            // Search Filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const titleMatch = paper.title.toLowerCase().includes(searchLower);
                const teacherMatch = paper.teacher?.name.toLowerCase().includes(searchLower);

                if (!titleMatch && !teacherMatch) {
                    return false;
                }
            }

            // Subject Filter (Inferred from title or just All for mock)
            if (filters.subject !== "All") {
                // simple inclusion check
                if (!paper.title.toLowerCase().includes(filters.subject.toLowerCase()) &&
                    !paper.badges.some(b => b.toLowerCase().includes(filters.subject.toLowerCase()))) {
                    return false;
                }
            }

            // Standard Filter
            if (filters.standard !== "All" && paper.standard !== filters.standard) {
                return false;
            }

            // Difficulty Filter (Check badges)
            if (filters.difficulty !== "All") {
                if (!paper.badges.includes(filters.difficulty)) return false;
            }

            // Rating Filter
            if (filters.rating !== "All") {
                if (filters.rating === "4 ★ & above" && paper.rating < 4) return false;
            }

            return true;
        });
    }, [filters]);

    // 3. Pagination Logic
    const totalItems = filteredPapers.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPapers = filteredPapers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Smart Pagination Generator
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) pages.push(i);
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
            }
        }
        return pages;
    };

    return (
        <div className="max-w-[1500px] mx-auto pb-10 px-4 sm:px-6 lg:px-8">
            <MobileFilterSidebar
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Page Header */}
            <div className="mb-6 mt-4">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold text-gray-900">Public Papers ({totalItems})</h1>
                </div>
                <p className="text-gray-500 text-sm ml-8">Discover and access quality papers created by expert teachers</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Sidebar (Desktop) */}
                <div className="hidden lg:block sticky top-6">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full">

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
                        {/* Search */}
                        <div className="relative w-full sm:w-[350px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Paper by Subject or Teacher Name"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Actions Row (Filter Trigger & Sort) */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">

                            {/* Mobile Filter Trigger */}
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex-1 sm:flex-none justify-center"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters ({Object.values(filters).filter(v => v !== "All").length})
                            </button>

                            {/* Sort */}
                            <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
                                <span className="text-sm font-semibold text-gray-500 hidden sm:inline">Sort By</span>
                                <div className="relative w-full sm:w-auto">
                                    <button className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-md text-sm font-bold text-indigo-700 whitespace-nowrap">
                                        Most Recent
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Papers List */}
                    {currentPapers.length > 0 ? (
                        <div className="space-y-4">
                            {currentPapers.map((paper) => (
                                <TeacherPaperCard key={paper.id} paper={paper} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No papers found</h3>
                            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
                            <button
                                onClick={() => setFilters({ subject: "All", standard: "All", difficulty: "All", rating: "All", search: "" })}
                                className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalItems > 0 && (
                        <div className="mt-10 flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Prev
                                </button>

                                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[280px] sm:max-w-none px-2 no-scrollbar">
                                    {getPageNumbers().map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handlePageChange(num)}
                                            className={`min-w-[32px] h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all shrink-0
                                            ${num === currentPage
                                                    ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm"
                                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>

                            <p className="text-sm text-gray-400 font-medium">
                                Showing <span className="text-gray-900 font-bold">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> papers
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
