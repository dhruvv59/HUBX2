"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Mock Data ---

type PerformanceLevel = "Excellent" | "Average" | "Poor";

interface Chapter {
    id: string;
    name: string;
}

interface Subject {
    id: string;
    name: string;
    score: number;
    performance: PerformanceLevel;
    chapters: Chapter[];
}

const subjectsData: Subject[] = [
    {
        id: "science",
        name: "Science",
        score: 92,
        performance: "Excellent",
        chapters: Array.from({ length: 10 }).map((_, i) => ({ id: `sci-${i}`, name: `Science Chapter ${i + 1}` })),
    },
    {
        id: "mathematics",
        name: "Mathematics",
        score: 59,
        performance: "Average",
        chapters: Array.from({ length: 15 }).map((_, i) => ({ id: `math-${i}`, name: `Math Chapter ${i + 1}` })),
    },
    {
        id: "geography",
        name: "Geography",
        score: 84,
        performance: "Excellent",
        chapters: Array.from({ length: 8 }).map((_, i) => ({ id: `geo-${i}`, name: `Geography Chapter ${i + 1}` })),
    },
    {
        id: "english",
        name: "English",
        score: 89,
        performance: "Excellent",
        chapters: Array.from({ length: 12 }).map((_, i) => ({ id: `eng-${i}`, name: `English Chapter ${i + 1}` })),
    },
    {
        id: "hindi",
        name: "Hindi",
        score: 81,
        performance: "Excellent",
        chapters: Array.from({ length: 10 }).map((_, i) => ({ id: `hin-${i}`, name: `Hindi Chapter ${i + 1}` })),
    },
    {
        id: "social_science",
        name: "Social Science",
        score: 37,
        performance: "Poor",
        chapters: [
            { id: "ss-1", name: "The French Revolution" },
            { id: "ss-2", name: "Socialism in Europe and the Russian Revolution" },
            { id: "ss-3", name: "Nazism and the Rise of Hitler" },
            { id: "ss-4", name: "Forest, Society and Colonialism" },
            { id: "ss-5", name: "Pastoralists in the Modern World" },
            { id: "ss-6", name: "Natural Vegetation and Wildlife" },
            { id: "ss-7", name: "Interdisciplinary project as part of multiple assessments" },
            { id: "ss-8", name: "Population" },
            { id: "ss-9", name: "What is Democracy?" },
            { id: "ss-10", name: "Constitutional Desig" },
            { id: "ss-11", name: "Electoral Politics" },
            { id: "ss-12", name: "Working of Institutions" },
            { id: "ss-13", name: "Democratic Rights" },
        ],
    },
    {
        id: "it",
        name: "Information Technology",
        score: 94,
        performance: "Excellent",
        chapters: Array.from({ length: 5 }).map((_, i) => ({ id: `it-${i}`, name: `IT Chapter ${i + 1}` })),
    },
    {
        id: "economics",
        name: "Economics",
        score: 44,
        performance: "Poor",
        chapters: Array.from({ length: 8 }).map((_, i) => ({ id: `eco-${i}`, name: `Economics Chapter ${i + 1}` })),
    },
];

const performanceColors: Record<PerformanceLevel, string> = {
    Excellent: "text-green-500",
    Average: "text-orange-500",
    Poor: "text-red-500",
};

const performanceBgColors: Record<PerformanceLevel, string> = {
    Excellent: "bg-green-500",
    Average: "bg-orange-500",
    Poor: "bg-red-500",
};

// --- Components ---

function SubjectCheckbox({
    subject,
    isSelected,
    onToggle,
}: {
    subject: Subject;
    isSelected: boolean;
    onToggle: () => void;
}) {
    return (
        <div
            onClick={onToggle}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
            <div
                className={cn(
                    "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                    isSelected ? "bg-[#6366f1] border-[#6366f1]" : "border-gray-300 bg-white"
                )}
            >
                {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
            </div>
            <span className="text-sm font-medium text-gray-700">
                {subject.name} <span className={performanceColors[subject.performance]}>({subject.score}%)</span>
            </span>
        </div>
    );
}

function ChapterAccordion({
    subject,
    selectedChapters,
    onToggleChapter,
    onSelectAllChapters,
}: {
    subject: Subject;
    selectedChapters: string[];
    onToggleChapter: (id: string) => void;
    onSelectAllChapters: (ids: string[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [includePoor, setIncludePoor] = useState(false);

    const allSelected = subject.chapters.every((ch) => selectedChapters.includes(ch.id));

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div
                className="flex items-center justify-between p-4 bg-gray-50/50 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-gray-800">Select {subject.name} Chapters</span>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIncludePoor(!includePoor);
                        }}
                        className={cn(
                            "flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                            includePoor
                                ? "bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20"
                                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                        )}
                    >
                        <div
                            className={cn(
                                "h-3 w-3 rounded-full border flex items-center justify-center",
                                includePoor ? "bg-[#6366f1] border-[#6366f1]" : "border-gray-400"
                            )}
                        >
                            {includePoor && <Check className="h-2 w-2 text-white" />}
                        </div>
                        <span>Include Poor Performed Chapters</span>
                    </button>
                    {isOpen ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                </div>
            </div>

            {isOpen && (
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg w-fit">
                        <div
                            onClick={() => {
                                const ids = subject.chapters.map((c) => c.id);
                                onSelectAllChapters(allSelected ? [] : ids);
                            }}
                            className={cn(
                                "h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-colors",
                                allSelected ? "bg-[#6366f1] border-[#6366f1]" : "border-gray-300 bg-white"
                            )}
                        >
                            {allSelected && <Check className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 cursor-pointer" onClick={() => onSelectAllChapters(allSelected ? [] : subject.chapters.map(c => c.id))}>All</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                        {subject.chapters.map((chapter) => {
                            const isSelected = selectedChapters.includes(chapter.id);
                            return (
                                <div
                                    key={chapter.id}
                                    onClick={() => onToggleChapter(chapter.id)}
                                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                                >
                                    <div
                                        className={cn(
                                            "h-5 w-5 rounded border flex items-center justify-center transition-colors shrink-0",
                                            isSelected ? "bg-gray-800 border-gray-800" : "border-gray-300 group-hover:border-gray-400"
                                        )}
                                    >
                                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                    </div>
                                    <span className="text-sm text-gray-600">{chapter.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SmartAssessmentPage() {
    const [difficulty, setDifficulty] = useState("Advanced");
    const [timeLimit, setTimeLimit] = useState("30");
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(["mathematics", "geography", "social_science", "english", "hindi", "it", "economics"]);
    const [selectedChapters, setSelectedChapters] = useState<string[]>(["ss-1", "ss-2"]); // Mock initial selection

    const toggleSubject = (id: string) => {
        setSelectedSubjectIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const toggleAllSubjects = () => {
        if (selectedSubjectIds.length === subjectsData.length) {
            setSelectedSubjectIds([]);
        } else {
            setSelectedSubjectIds(subjectsData.map((s) => s.id));
        }
    };

    const selectedSubjects = subjectsData.filter((s) => selectedSubjectIds.includes(s.id));
    const totalQuestions = selectedSubjects.length * 10; // Mock calculation

    return (
        <div className="min-h-screen bg-[#fafbfc] p-6 lg:p-8 space-y-8 font-sans">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-2">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">AI Smart Assessment</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Controls Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            {/* Difficulty */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">Assessment Difficulty Level:</label>
                                <div className="flex items-center space-x-6">
                                    {["Easy", "Intermediate", "Advanced"].map((level) => (
                                        <label key={level} className="flex items-center space-x-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="difficulty"
                                                    value={level}
                                                    checked={difficulty === level}
                                                    onChange={(e) => setDifficulty(e.target.value)}
                                                    className="peer appearance-none h-5 w-5 rounded-full border-2 border-gray-300 checked:border-[#6366f1] transition-all"
                                                />
                                                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#6366f1] opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className={cn("text-sm", difficulty === level ? "text-gray-900 font-medium" : "text-gray-500 group-hover:text-gray-700")}>
                                                {level}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Time Limit */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">Assessment Time Limit In Minutes:</label>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={timeLimit === "unlimited" ? "" : timeLimit}
                                            onChange={(e) => setTimeLimit(e.target.value)}
                                            placeholder="90"
                                            className="border border-gray-300 rounded px-3 py-1.5 w-16 text-center text-sm font-medium focus:outline-none focus:border-[#6366f1]"
                                        />
                                        <span className="ml-2 text-sm text-gray-500">Mins</span>
                                    </div>
                                    <button
                                        onClick={() => setTimeLimit(timeLimit === "unlimited" ? "90" : "unlimited")}
                                        className={cn(
                                            "px-4 py-1.5 text-sm rounded border transition-colors",
                                            timeLimit === "unlimited" ? "bg-[#6366f1] text-white border-[#6366f1]" : "text-gray-500 border-gray-300 hover:border-gray-400"
                                        )}
                                    >
                                        No Limit
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subjects Selection */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Select Subjects</h3>
                                <div className="flex items-center space-x-4 text-xs">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="text-gray-500">Excellent Performance</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                                        <span className="text-gray-500">Average Performance</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                        <span className="text-gray-500">Poor Performance</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div
                                    onClick={toggleAllSubjects}
                                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <div
                                        className={cn(
                                            "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                                            selectedSubjectIds.length === subjectsData.length ? "bg-[#6366f1] border-[#6366f1]" : "border-gray-300 bg-white"
                                        )}
                                    >
                                        {selectedSubjectIds.length === subjectsData.length && <Check className="h-3.5 w-3.5 text-white" />}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">All</span>
                                </div>

                                {subjectsData.map((subject) => (
                                    <SubjectCheckbox
                                        key={subject.id}
                                        subject={subject}
                                        isSelected={selectedSubjectIds.includes(subject.id)}
                                        onToggle={() => toggleSubject(subject.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chapters Sections */}
                    <div className="space-y-4">
                        {selectedSubjects.map((subject) => (
                            <ChapterAccordion
                                key={subject.id}
                                subject={subject}
                                selectedChapters={selectedChapters}
                                onToggleChapter={(id) => {
                                    setSelectedChapters(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                                }}
                                onSelectAllChapters={(ids) => {
                                    // Filter out this subject's chapters first
                                    const otherChapters = selectedChapters.filter(id => !subject.chapters.find(c => c.id === id));
                                    setSelectedChapters([...otherChapters, ...ids]);
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[380px] space-y-4">
                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Assessment Summary</h3>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold text-[#6366f1] uppercase tracking-wide mb-1">SUBJECTS</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">
                                        {selectedSubjects.slice(0, 2).map(s => s.name).join(", ")}
                                        {selectedSubjects.length > 2 && <span className="text-[#ff5757] ml-1">+{selectedSubjects.length - 2}</span>}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="border-t border-gray-50 pt-4">
                                <p className="text-xs font-semibold text-[#6366f1] uppercase tracking-wide mb-1">TOTAL NO OF QUESTIONS</p>
                                <p className="text-xl font-bold text-gray-900">{totalQuestions}</p>
                            </div>

                            <div className="border-t border-gray-50 pt-4">
                                <p className="text-xs font-semibold text-[#6366f1] uppercase tracking-wide mb-1">DIFFICULTY LEVEL</p>
                                <p className="text-sm font-bold text-gray-900">{difficulty}</p>
                            </div>

                            <div className="border-t border-gray-50 pt-4">
                                <div className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <p className="text-xs font-semibold text-[#6366f1] uppercase tracking-wide mb-1">CHAPTERS</p>
                                        <p className="text-xl font-bold text-gray-900">{selectedChapters.length}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <button className="w-full py-3.5 bg-[#5b5bd6] hover:bg-[#4f4fbe] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all transform active:scale-95">
                                START ASSESSMENT
                            </button>
                        </div>
                    </div>

                    {/* Secondary Actions */}
                    <button className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#6366f1] hover:shadow-md transition-all group">
                        <span className="font-bold text-gray-800 text-sm group-hover:text-[#6366f1] italic">VIEW PREVIOUS RESULTS</span>
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#6366f1]/10">
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#6366f1]" />
                        </div>
                    </button>

                    <button className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#6366f1] hover:shadow-md transition-all group">
                        <span className="font-bold text-gray-800 text-sm group-hover:text-[#6366f1] italic">VIEW MARKED QUESTIONS</span>
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#6366f1]/10">
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#6366f1]" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
