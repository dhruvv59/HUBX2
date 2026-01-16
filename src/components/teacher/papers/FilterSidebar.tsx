"use client";

import React, { useState } from "react";
import { ChevronRight, Sparkles, ArrowRight } from "lucide-react";

interface FilterSectionProps {
    title: string;
    options: string[];
    selected: string;
    onChange: (value: string) => void;
}

function FilterSection({ title, options, selected, onChange }: FilterSectionProps) {
    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-4">{title}</h3>
            <div className="space-y-3">
                {options.map((option) => (
                    <label key={option} className="flex items-center cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                            <input
                                type="radio"
                                className="peer appearance-none w-5 h-5 border-[1.5px] border-gray-300 rounded-full checked:border-[#6366f1] checked:border-[5px] transition-all"
                                checked={selected === option}
                                onChange={() => onChange(option)}
                            />
                        </div>
                        <span className={`text-sm font-semibold transition-colors ${selected === option ? "text-[#6366f1]" : "text-gray-500 group-hover:text-gray-700"}`}>
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export function FilterSidebar() {
    const [subject, setSubject] = useState("All");
    const [standard, setStandard] = useState("9th");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [rating, setRating] = useState("4 & above");

    return (
        <div className="w-[280px] flex-shrink-0 pt-2">
            {/* Filter Group */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                <FilterSection
                    title="Subjects"
                    options={["All", "Science", "Mathematics"]}
                    selected={subject}
                    onChange={setSubject}
                />
                <FilterSection
                    title="Standard"
                    options={["All", "8th", "9th", "10th"]}
                    selected={standard}
                    onChange={setStandard}
                />
                <FilterSection
                    title="Difficulty Level"
                    options={["All", "Beginner", "Intermediate", "Advanced"]}
                    selected={difficulty}
                    onChange={setDifficulty}
                />
                <FilterSection
                    title="Rating"
                    options={["4 ★ & above", "Most Popular"]}
                    selected={rating}
                    onChange={setRating}
                />
            </div>

            {/* AI Banner Sidebar */}
            <div className="h-[120px] bg-white rounded-2xl border border-[#e9d5ff] p-6 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-black italic text-gray-900 leading-none">
                            AI SMART <br />
                            <span className="text-[#a855f7]">GENERATOR</span>
                            <Sparkles className="inline-block w-5 h-5 text-[#a855f7] ml-2 fill-current" />
                        </h3>
                    </div>
                </div>
                <div className="self-end h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center bg-white z-10 group-hover:border-indigo-400 group-hover:text-indigo-600 transition-colors">
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
                </div>
            </div>
        </div>
    );
}
