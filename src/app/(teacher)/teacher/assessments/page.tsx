"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, ArrowLeft, Filter, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrivatePapersFilters } from "@/components/teacher/private-papers/PrivatePapersFilters";
import { PrivatePaperCard } from "@/components/teacher/private-papers/PrivatePaperCard";
import { PrivatePaper, PrivatePaperFilters as FiltersType } from "@/types/private-paper";
import { getPrivatePapers } from "@/services/private-paper-service";

// Simple debounce hook implementation if not present
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

function PrivatePapersPageContent() {
    const router = useRouter();

    // Filter State
    const [filters, setFilters] = useState<FiltersType>({
        subject: "All",
        std: "All",
        difficulty: "All",
        search: "",
        sortBy: "Most Recent",
        page: 1,
        limit: 9
    });

    const [papers, setPapers] = useState<PrivatePaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPapers, setTotalPapers] = useState(0);

    const debouncedSearch = useDebounceValue(filters.search, 500);

    useEffect(() => {
        const fetchPapers = async () => {
            setIsLoading(true);
            try {
                const data = await getPrivatePapers({
                    ...filters,
                    search: debouncedSearch
                });
                setPapers(data.papers);
                setTotalPapers(data.total);
            } catch (error) {
                console.error("Failed to fetch papers", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPapers();
    }, [filters.subject, filters.std, filters.difficulty, filters.sortBy, filters.page, debouncedSearch]);

    const handleFilterChange = (key: keyof Omit<FiltersType, "page" | "limit">, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalPapers / (filters.limit || 9))) {
            setFilters(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const totalPages = Math.ceil(totalPapers / (filters.limit || 9));

    return (
        <div className="max-w-[1300px] mx-auto pb-20 pt-10 px-6">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Private Papers ({totalPapers})</h1>
                </div>
                <p className="text-gray-500 text-sm ml-9 font-medium">Discover and access quality papers created by expert teachers</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <PrivatePapersFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                <div className="flex-1 w-full">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="relative w-full md:w-[400px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Paper by Subject or Teacher Name"
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#5b5bd6] placeholder:text-gray-400"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Sort By
                            </span>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-bold text-[#5b5bd6] focus:outline-none bg-white cursor-pointer"
                            >
                                <option>Most Recent</option>
                                <option>Most Popular</option>
                                <option>Highest Rated</option>
                            </select>
                        </div>
                    </div>

                    {/* Papers List */}
                    {isLoading ? (
                        <div className="min-h-[400px] flex items-center justify-center flex-col gap-2">
                            <Loader2 className="w-8 h-8 text-[#5b5bd6] animate-spin" />
                            <p className="text-sm text-gray-500 font-medium">Loading papers...</p>
                        </div>
                    ) : papers.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {papers.map(paper => (
                                    <PrivatePaperCard key={paper.id} paper={paper} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => handlePageChange((filters.page || 1) - 1)}
                                        disabled={(filters.page || 1) === 1}
                                        className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Prev
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        // Complex logic to show window of pages could go here, 
                                        // keeping it simple for < 5 pages or showing first 5 for now 
                                        // to match the "pixel perfect" aesthetic without over-engineering logic blindly.
                                        // A Sliding Window is better:
                                        let pageNum = i + 1;
                                        const currentPage = filters.page || 1;

                                        if (totalPages > 5) {
                                            // Center around current page
                                            if (currentPage > 3) {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            // Cap at totalPages
                                            if (pageNum > totalPages) return null;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${currentPage === pageNum
                                                    ? "bg-[#eeeaff] text-[#5b5bd6]"
                                                    : "hover:bg-gray-50 text-gray-500"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    {totalPages > 5 && (filters.page || 1) < totalPages - 2 && (
                                        <span className="text-gray-400 text-xs">...</span>
                                    )}

                                    <button
                                        onClick={() => handlePageChange((filters.page || 1) + 1)}
                                        disabled={(filters.page || 1) === totalPages}
                                        className="px-3 py-1 text-xs font-bold text-[#5b5bd6] hover:text-[#4f46e5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Search className="w-6 h-6 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No papers found</h3>
                            <p className="text-sm text-gray-500 max-w-xs">
                                Try adjusting your filters or search query to find what you're looking for.
                            </p>
                            <button
                                onClick={() => setFilters({
                                    subject: "All",
                                    std: "All",
                                    difficulty: "All",
                                    search: "",
                                    sortBy: "Most Recent",
                                    page: 1,
                                    limit: 9
                                })}
                                className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default function PrivatePapersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#5b5bd6] animate-spin" /></div>}>
            <PrivatePapersPageContent />
        </Suspense>
    );
}
