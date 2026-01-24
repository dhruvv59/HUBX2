"use client";

import React from "react";
import { Question } from "@/types/generate-paper";
import { cn } from "@/lib/utils";

interface AddedQuestionsListProps {
    questions: Question[];
    onRemove: (id: string) => void;
}

export function AddedQuestionsList({ questions, onRemove }: AddedQuestionsListProps) {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
                Science Intermediate Paper 2025 - Added Questions
            </h3>

            <div className="space-y-6">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        {/* Header Tags & Remove */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold border",
                                    q.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" :
                                        q.difficulty === "Intermediate" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    {q.difficulty}
                                </span>
                                {/* Mock Chapter Tag - Since we don't capture chapter per question yet, using placeholder or passed prop */}
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold border border-gray-200 text-gray-600 bg-gray-50">
                                    Thermodynamics
                                </span>
                            </div>
                            <button
                                onClick={() => onRemove(q.id)}
                                className="px-4 py-1.5 rounded-full border border-red-200 text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                                Remove
                            </button>
                        </div>

                        {/* Question Content */}
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-gray-900 mb-2">
                                Q{index + 1} - <span className="font-semibold text-gray-800">{q.content}</span>
                            </h4>
                        </div>

                        {/* Solution Content */}
                        <div>
                            <h5 className="text-xs font-bold text-[#10b981] mb-2 uppercase tracking-wide">Solution</h5>
                            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {q.solution}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
