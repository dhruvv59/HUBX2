"use client";

import React from "react";
import { ArrowLeft, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { FilterSidebar } from "@/components/teacher/papers/FilterSidebar";
import { TeacherPaperCard } from "@/components/teacher/papers/TeacherPaperCard";
import { MOCK_PAPERS } from "@/services/mock-papers";

export default function PublicPapersPage() {
    return (
        <div className="max-w-[1500px] mx-auto pb-10">

            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <button className="text-gray-500 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Public Papers (99)</h1>
                </div>
                <p className="text-gray-500 text-sm ml-8">Discover and access quality papers created by expert teachers</p>
            </div>

            <div className="flex gap-8 items-start">

                {/* Left Sidebar */}
                <FilterSidebar />

                {/* Main Content */}
                <div className="flex-1">

                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Search */}
                        <div className="relative w-[350px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Paper by Subject or Teacher Name"
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500">Sort By</span>
                            <div className="relative">
                                <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-md text-sm font-bold text-indigo-700">
                                    Most Recent
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Papers List */}
                    <div className="space-y-4">
                        {MOCK_PAPERS.map((paper) => (
                            <TeacherPaperCard key={paper.id} paper={paper} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center mt-10 gap-2">
                        <span className="text-sm font-medium text-gray-400 mr-2">Prev</span>
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <button
                                key={num}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all
                                ${num === 1
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                            >
                                {num}
                            </button>
                        ))}
                        <button className="text-sm font-bold text-indigo-600 ml-2">Next</button>
                    </div>

                </div>
            </div>
        </div>
    );
}
