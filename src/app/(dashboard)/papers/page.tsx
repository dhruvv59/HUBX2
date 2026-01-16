"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Search,
    Filter,
    ChevronDown,
    Star,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PublicPaper, PaperFilters } from "@/types/assessment";
import { getPublicPapers } from "@/services/paper";
import { PaperCard } from "@/components/assessment/PaperCard";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { TestSettingsModal } from "@/components/assessment/TestSettingsModal";

// --- Filters Component (kept local as it's specific to this page layout) ---
interface FilterSidebarProps {
    filters: PaperFilters;
    onFilterChange: (newFilters: Partial<PaperFilters>) => void;
    totalCount: number;
}

function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
    const router = useRouter();
    const subjects = ["All", "Science", "Mathematics", "Geography", "English", "Hindi", "Social Science", "Information Technology", "Economics"];
    const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
    const ratings = ["4 ★ & above", "Most Popular"];

    return (
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
            {/* Main Filter Card */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 h-fit">
                {/* Subjects */}
                <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Subjects</h3>
                    <div className="space-y-3">
                        {subjects.map((subject) => (
                            <label key={subject} className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center shrink-0">
                                    <input
                                        type="radio"
                                        name="subject_filter"
                                        checked={(filters.subject || "All") === subject}
                                        onChange={() => onFilterChange({ subject })}
                                        className="appearance-none h-5 w-5 rounded-full border border-gray-300 checked:border-[#6366f1] transition-colors focus:ring-0 focus:ring-offset-0"
                                    />
                                    <div className="absolute h-2.5 w-2.5 bg-[#6366f1] rounded-full opacity-0 scale-0 transition-transform duration-200 ease-in-out peer-checked:opacity-100 peer-checked:scale-100 input:checked~&" />
                                    <style jsx>{`
                                        input:checked + div { opacity: 1; transform: scale(1); }
                                    `}</style>
                                </div>
                                <span className={cn("text-[14px]", (filters.subject || "All") === subject ? "text-[#6366f1] font-bold" : "text-gray-500 font-medium")}>{subject}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="border-t border-gray-100 pt-6 mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Difficulty Level</h3>
                    <div className="space-y-3">
                        {difficulties.map((level) => (
                            <label key={level} className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center shrink-0">
                                    <input
                                        type="radio"
                                        name="difficulty_filter"
                                        checked={(filters.level || "All") === level}
                                        onChange={() => onFilterChange({ level })}
                                        className="appearance-none h-5 w-5 rounded-full border border-gray-300 checked:border-[#6366f1] transition-colors focus:ring-0 focus:ring-offset-0"
                                    />
                                    <div className="absolute h-2.5 w-2.5 bg-[#6366f1] rounded-full opacity-0 scale-0 transition-transform duration-200 ease-in-out" />
                                    <style jsx>{`
                                        input:checked + div { opacity: 1; transform: scale(1); }
                                    `}</style>
                                </div>
                                <span className={cn("text-[14px]", (filters.level || "All") === level ? "text-[#6366f1] font-bold" : "text-gray-500 font-medium")}>{level}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Rating</h3>
                    <div className="space-y-3">
                        {ratings.map((rating) => (
                            <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center shrink-0">
                                    <input
                                        type="radio"
                                        name="rating_filter"
                                        checked={(filters.rating) === rating}
                                        onChange={() => onFilterChange({ rating })}
                                        className="appearance-none h-5 w-5 rounded-full border border-gray-300 checked:border-[#6366f1] transition-colors focus:ring-0 focus:ring-offset-0"
                                    />
                                    <div className="absolute h-2.5 w-2.5 bg-[#6366f1] rounded-full opacity-0 scale-0 transition-transform duration-200 ease-in-out" />
                                    <style jsx>{`
                                        input:checked + div { opacity: 1; transform: scale(1); }
                                    `}</style>
                                </div>
                                <span className={cn("text-[14px] flex items-center gap-1", (filters.rating) === rating ? "text-[#6366f1] font-bold" : "text-gray-500 font-medium")}>
                                    {rating === "4 ★ & above" ? (
                                        <>4 <Star className="h-3 w-3 fill-current text-orange-400" /> & above</>
                                    ) : (
                                        rating
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Cards */}
            <div className="space-y-4">
                <button
                    onClick={() => router.push("/papers/purchased")}
                    className="w-full bg-white rounded-[20px] p-5 shadow-sm border border-[#e0e7ff] flex items-center justify-between group hover:border-[#6366f1] transition-all"
                >
                    <span className="text-[13px] font-black italic text-gray-900 uppercase">View Purchased Papers</span>
                    <div className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center bg-white group-hover:bg-[#f5f6ff] transition-colors">
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#6366f1]" />
                    </div>
                </button>

                <button className="w-full bg-white rounded-[20px] p-5 shadow-sm border border-orange-200 flex items-center justify-between group hover:border-orange-400 transition-all">
                    <span className="text-[13px] font-black italic text-gray-900 uppercase">View Marked Questions</span>
                    <div className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center bg-white group-hover:bg-orange-50 transition-colors">
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500" />
                    </div>
                </button>
            </div>
        </div>
    );
}

export default function PublicPapersPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [papers, setPapers] = useState<PublicPaper[]>([]);
    const [filters, setFilters] = useState<PaperFilters>({
        subject: "All",
        level: "All",
        search: "",
        sortBy: "Most Recent"
    });

    // Modal Interaction
    const [selectedPaper, setSelectedPaper] = useState<PublicPaper | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const fetchPapers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getPublicPapers(filters);
            setPapers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPapers();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchPapers]);

    const handleFilterChange = (newFilters: Partial<PaperFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleTeacherClick = (teacherId: string) => {
        // Use mock ID for now as paper.teacher.id isn't strictly in my mock yet, assume 't1' if missing
        const targetId = teacherId || 't1';
        router.push(`/teachers/${targetId}`);
    };

    const handlePurchase = (paper: PublicPaper) => {
        setSelectedPaper(paper);
        setIsPaymentOpen(true);
    };

    const handlePreview = (paper: PublicPaper) => {
        setSelectedPaper(paper);
        setIsSettingsOpen(true);
    };

    const handlePaymentSuccess = () => {
        if (selectedPaper) {
            // Update local state to show as purchased
            setPapers(prev => prev.map(p =>
                p.id === selectedPaper.id ? { ...p, purchased: true } : p
            ));
        }
        setIsPaymentOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] p-6 font-sans">
            {/* Header */}
            <div className="mb-8 max-w-[1600px] mx-auto">
                <div className="flex items-center space-x-4 mb-2">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 p-1">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Public Papers ({99}) {/* Hardcoded for UI match or dynamic if API provides */}
                    </h1>
                </div>
                <p className="text-sm text-gray-500 font-medium ml-11">
                    Discover and access quality papers created by expert teachers
                </p>
            </div>

            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar Filter */}
                <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalCount={papers.length}
                />

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Search & Sort */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-[500px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Paper by Subject or Teacher Name"
                                value={filters.search}
                                onChange={(e) => handleFilterChange({ search: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] shadow-sm"
                            />
                        </div>

                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                            <Filter className="h-4 w-4 text-gray-500 sm:hidden" /> {/* Mobile Filter Trigger could go here */}
                            <span className="text-sm font-medium text-gray-600">Sort By</span>
                            <div className="relative">
                                <button
                                    onClick={() => handleFilterChange({
                                        sortBy: filters.sortBy === "Most Recent" ? "Price: Low to High" : "Most Recent"
                                    })}
                                    className="flex items-center space-x-2 px-4 py-2 bg-[#eaeaff] rounded-lg text-[#5b5bd6] text-sm font-bold min-w-[150px] justify-between cursor-pointer hover:bg-[#e0e0ff] transition-colors"
                                >
                                    <span>{filters.sortBy}</span>
                                    <ChevronDown className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Papers List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-[24px] p-6 h-[220px] animate-pulse border border-gray-100 flex flex-col gap-4">
                                    {/* Skeleton UI */}
                                    <div className="flex justify-between">
                                        <div className="h-6 bg-gray-100 rounded w-1/3" />
                                        <div className="h-6 bg-gray-100 rounded w-20" />
                                    </div>
                                    <div className="h-4 bg-gray-50 rounded w-1/2" />
                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="h-10 w-10 bg-gray-100 rounded-full" />
                                        <div className="h-10 w-24 bg-gray-100 rounded-lg" />
                                    </div>
                                </div>
                            ))
                        ) : papers.length > 0 ? (
                            papers.map(paper => (
                                <PaperCard
                                    key={paper.id}
                                    data={paper}
                                    onTeacherClick={() => handleTeacherClick(paper.teacher.id)}
                                    onPurchase={() => handlePurchase(paper)}
                                    onPreview={() => handlePreview(paper)}
                                    onStartTest={() => handlePreview(paper)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-lg font-bold text-gray-900">No papers found</p>
                                <p className="text-sm">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoading && papers.length > 0 && (
                        <div className="flex items-center justify-center space-x-2 pt-8 pb-10">
                            <span className="text-sm text-gray-400 font-medium mr-2 cursor-pointer hover:text-gray-600">Prev</span>
                            {[1, 2, 3, 4, 5, 6, 7].map(page => (
                                <button
                                    key={page}
                                    className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                        page === 1 ? "bg-[#eaeaff] text-[#5b5bd6] font-bold" : "text-gray-500 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                            <span className="text-sm text-[#5b5bd6] font-bold ml-2 cursor-pointer">Next</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                paperTitle={selectedPaper?.title || ""}
                amount={selectedPaper?.price || 0}
                onSuccess={handlePaymentSuccess}
            />

            <TestSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onStart={(settings) => {
                    setIsSettingsOpen(false);
                    if (selectedPaper) {
                        router.push(`/papers/${selectedPaper.id}/take`);
                    }
                }}
            />
        </div>
    );
}
