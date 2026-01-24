"use client";

import React, { useState } from "react";
import { Paperclip, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionType, Difficulty, Question } from "@/types/generate-paper";

interface ManualQuestionFormProps {
    questionNumber: number;
    onAdd: (question: Question) => void;
    onCancel: () => void;
    onOpenBank?: () => void;
    isSubmitting?: boolean;
}

export function ManualQuestionForm({ questionNumber, onAdd, onCancel, onOpenBank, isSubmitting }: ManualQuestionFormProps) {
    const [type, setType] = useState<QuestionType>("Text");
    const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
    const [content, setContent] = useState("");
    const [solution, setSolution] = useState("");

    const handleAdd = () => {
        onAdd({
            id: `q-${Date.now()}`,
            type,
            difficulty,
            content,
            solution
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-5 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-gray-900">Question {questionNumber}</span>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="qType"
                                checked={type === "Text"}
                                onChange={() => setType("Text")}
                                className="w-4 h-4 text-[#5b5bd6] border-gray-300 focus:ring-[#5b5bd6]"
                            />
                            <span className={cn("text-xs font-bold", type === "Text" ? "text-gray-900" : "text-gray-500")}>Text Question</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="qType"
                                checked={type === "MCQ"}
                                onChange={() => setType("MCQ")}
                                className="w-4 h-4 text-[#5b5bd6] border-gray-300 focus:ring-[#5b5bd6]"
                            />
                            <span className={cn("text-xs font-bold", type === "MCQ" ? "text-gray-900" : "text-gray-500")}>MCQ</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">Difficulty Level</span>
                    <div className="flex items-center gap-4">
                        {(["Easy", "Intermediate", "Advanced"] as Difficulty[]).map((level) => (
                            <label key={level} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="difficulty"
                                    checked={difficulty === level}
                                    onChange={() => setDifficulty(level)}
                                    className="w-4 h-4 text-[#5b5bd6] border-gray-300 focus:ring-[#5b5bd6]"
                                />
                                <span className={cn("text-xs font-bold", difficulty === level ? "text-gray-900" : "text-gray-500")}>{level}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-8 bg-[#fdfcff]/50">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Add Question Manually</h3>

                {/* Question Section */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 mb-2">Question</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:border-indigo-500 resize-none bg-white placeholder:text-gray-400"
                        placeholder="Distinguish between boiling and evaporation."
                    />
                    <div className="flex items-center justify-between mt-3">
                        <button className="text-xs font-bold text-[#5b5bd6] hover:underline">View Question</button>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1.5 text-xs font-bold text-[#5b5bd6] hover:text-[#4f46e5]">
                                <Paperclip className="w-3.5 h-3.5" />
                                Attach Image for question
                            </button>
                            <button
                                onClick={onOpenBank}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#5b5bd6] hover:text-[#4f46e5]"
                            >
                                <HelpCircle className="w-3.5 h-3.5" />
                                Add from Question Bank
                            </button>
                        </div>
                    </div>
                </div>

                {/* Solution Section */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 mb-2">Solution</label>
                    <textarea
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:border-indigo-500 resize-none bg-white placeholder:text-gray-400"
                        placeholder="Occurs throughout the liquid. Occurs only at the surface..."
                    />
                    <div className="flex items-center justify-between mt-3">
                        <button className="text-xs font-bold text-[#5b5bd6] hover:underline">View Solution</button>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[#5b5bd6] hover:text-[#4f46e5]">
                            <Paperclip className="w-3.5 h-3.5" />
                            Attach Image for solution
                        </button>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="h-10 px-8 rounded-lg border border-[#5b5bd6] text-[#5b5bd6] text-xs font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={!content.trim() || isSubmitting}
                        className="h-10 px-8 rounded-lg bg-[#5b5bd6] text-white text-xs font-bold hover:bg-[#4f46e5] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                        Add Question
                    </button>
                </div>
            </div>
        </div>
    );
}
