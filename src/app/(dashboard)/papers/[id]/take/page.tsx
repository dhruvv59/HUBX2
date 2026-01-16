"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    HelpCircle,
    Check,
    X,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data Types (Internal for this flow, could be moved to types) ---
interface QuestionData {
    id: number;
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
    explanation?: string; // For immediate feedback
}

const MOCK_QUESTIONS: QuestionData[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    text: "What is the speed of light in vacuum?", // Reusing same text for visual match
    options: [
        { id: "A", text: "3 x 10⁸ m/s" },
        { id: "B", text: "3 x 10⁹ m/s" },
        { id: "C", text: "3 x 10⁵ m/s" },
        { id: "D", text: "3 x 10⁶ m/s" } // Varied slightly
    ],
    correctOptionId: "A",
    explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s². This value varies slightly with location due to Earth's rotation and local geological features."
}));

// --- Main Page Component ---
export default function TakePaperPage() {
    const params = useParams();
    const router = useRouter();
    const paperId = params.id as string;

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({}); // { questionId: optionId }
    const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
    const [doubts, setDoubts] = useState<number[]>([]);

    // Timer
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

    // Immediate Feedback Mode (if enabled in settings)
    const [showFeedback, setShowFeedback] = useState(false); // Controls if we show right/wrong instantly
    const [isSubmitted, setIsSubmitted] = useState(false); // For specific question submission if needed? Or visually just immediate.

    // In design: "Question 1" and options. Bottom: Prev, Next.
    // Right sidebar: "Test Progress", Timer, Stats grid, Score at bottom.

    const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];

    // Derived Stats
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = MOCK_QUESTIONS.length;

    // Timer Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionId: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
        // Logic to show feedback immediately? The design shows "Your Answer" and "Correct Answer" labels.
        // Assuming "Show answers after wrong" setting is ON implies we show it after selection or after a "Check" action.
        // The image shows radio buttons, and one state has "Your Answer" red tag and "Correct Answer" green tag.
        // This implies immediate validation upon selection OR automatic validation.
        // Let's assume immediate validation for this visual demo.
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const toggleMark = () => {
        setMarkedQuestions(prev =>
            prev.includes(currentQuestion.id)
                ? prev.filter(id => id !== currentQuestion.id)
                : [...prev, currentQuestion.id]
        );
    };

    // Helper to determine option style
    const getOptionStyle = (optionId: string) => {
        // If not answered yet, standard hover
        if (!currentAnswer) return "border-gray-100 hover:bg-gray-50";

        // If this is the selected answer
        if (currentAnswer === optionId) {
            // Correct?
            if (optionId === currentQuestion.correctOptionId) {
                return "border-[#22c55e] bg-green-50 ring-1 ring-[#22c55e]";
            } else {
                return "border-[#ff5757] bg-red-50 ring-1 ring-[#ff5757]";
            }
        }

        // If this is the correct answer and we selected WRONG, show correct
        if (currentAnswer !== currentQuestion.correctOptionId && optionId === currentQuestion.correctOptionId) {
            return "border-[#22c55e] bg-green-50 ring-1 ring-[#22c55e]";
        }

        return "border-gray-100 opacity-50";
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
            {/* Header / Nav if needed (Image shows clean view with back arrow) */}
            <div className="bg-white px-8 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Mathematics Fundamental Test</h1>
                        <p className="text-xs text-gray-500 font-medium">Algebra, Geometry, Trigonometry</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Image
                        src="/assets/images/avatar-female-1.png"
                        alt="User" width={32} height={32} className="rounded-full"
                    />
                </div>
            </div>

            <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 flex flex-col lg:flex-row gap-6">

                {/* Left: Question Area */}
                <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
                    {/* Q List Sidebar (Mini) */}
                    <div className="w-[70px] border-r border-gray-100 flex flex-col items-center py-4 space-y-2 overflow-y-auto max-h-[800px] scrollbar-thin">
                        {MOCK_QUESTIONS.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                                    currentQuestionIndex === idx
                                        ? "bg-[#eaeaff] text-[#5b5bd6] ring-2 ring-[#5b5bd6] ring-offset-1"
                                        : answers[q.id]
                                            ? "bg-green-50 text-green-600 border border-green-200"
                                            : "text-gray-400 hover:bg-gray-50"
                                )}
                            >
                                Q{q.id}
                            </button>
                        ))}
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 p-8 relative flex flex-col">

                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[#5b5bd6] text-xs font-bold tracking-wider uppercase">QUESTION {currentQuestion.id}</span>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400" title="Doubt">
                                    <HelpCircle className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={toggleMark}
                                    className={cn("p-2 rounded-lg transition-colors", markedQuestions.includes(currentQuestion.id) ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:bg-gray-50")} title="Mark for later"
                                >
                                    <Flag className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400" title="Next Section">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Text */}
                        <h2 className="text-lg font-bold text-gray-900 mb-8">
                            {currentQuestion.text}
                        </h2>

                        {/* Options */}
                        <div className="space-y-4 mb-8">
                            {currentQuestion.options.map((option) => {
                                const isSelected = currentAnswer === option.id;
                                const isCorrect = option.id === currentQuestion.correctOptionId;
                                const styleClass = getOptionStyle(option.id);

                                return (
                                    <label
                                        key={option.id}
                                        className={cn(
                                            "flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer group relative",
                                            styleClass
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${currentQuestion.id}`}
                                            className="hidden"
                                            checked={isSelected}
                                            onChange={() => handleOptionSelect(option.id)}
                                            disabled={!!currentAnswer} // Disable changing after selecting if immediate mode
                                        />

                                        {/* Custom Radio Circle */}
                                        <div className={cn(
                                            "h-5 w-5 rounded-full border-[2px] flex items-center justify-center mr-4 shrink-0 transition-colors",
                                            isSelected ? (isCorrect ? "border-green-500 bg-green-500" : "border-red-500 bg-red-500") : "border-gray-300 group-hover:border-gray-400"
                                        )}>
                                            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                                        </div>

                                        <span className={cn("text-sm font-bold flex-1", isSelected ? "text-gray-900" : "text-gray-600")}>
                                            <span className="mr-2 opacity-70">{option.id}.</span> {option.text}
                                        </span>

                                        {/* Feedback Labels */}
                                        {currentAnswer && (
                                            <div className="absolute right-4 flex items-center">
                                                {isSelected && !isCorrect && (
                                                    <div className="flex items-center space-x-1 text-[#ff5757]">
                                                        <span className="text-[10px] font-black uppercase tracking-wider">YOUR ANSWER</span>
                                                        <X className="h-4 w-4 stroke-[3]" />
                                                    </div>
                                                )}
                                                {isCorrect && (currentAnswer === option.id || currentAnswer) && (
                                                    <div className="flex items-center space-x-1 text-[#22c55e]">
                                                        <span className="text-[10px] font-black uppercase tracking-wider">CORRECT ANSWER</span>
                                                        <Check className="h-4 w-4 stroke-[3]" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        {/* Action Buttons Center */}
                        <div className="flex items-center justify-center space-x-4 mt-auto">
                            <button
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                                className="px-8 py-2.5 rounded-lg border border-gray-300 text-gray-500 font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Prev
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-8 py-2.5 rounded-lg bg-[#5b5bd6] text-white font-bold hover:bg-[#4f4fbe] transition-colors shadow-md shadow-indigo-200"
                            >
                                {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
                            </button>
                        </div>

                        {/* Explanation Box (Conditional) */}
                        {currentAnswer && currentAnswer !== currentQuestion.correctOptionId && (
                            <div className="mt-8 p-6 rounded-xl border border-green-200 bg-[#f0fdf4] animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-green-700 font-bold text-sm mb-2">Solution</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Progress Sidebar */}
                <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                    {/* Timer Card */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-purple-100">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold text-gray-900">Test Progress</span>
                            <div className="flex items-center space-x-2 text-[#ff5757] bg-red-50 px-3 py-1 rounded-full">
                                <Clock className="h-4 w-4" />
                                <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">ANSWERED</span>
                                <span className="text-sm font-bold text-gray-900">{answeredCount}/60</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">WRONG ANSWERS</span>
                                <span className="text-sm font-bold text-gray-900">0</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">DOUBTS</span>
                                <div className="flex items-center space-x-2">
                                    <Flag className="h-3 w-3 text-[#5b5bd6]" />
                                    <span className="text-sm font-bold text-gray-900">0</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">ASK TEACHER</span>
                                <div className="flex items-center space-x-2">
                                    <HelpCircle className="h-3 w-3 text-orange-500" />
                                    <span className="text-sm font-bold text-gray-900">0</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">MARKED QUESTION</span>
                                <div className="flex items-center space-x-2">
                                    <ChevronRight className="h-3 w-3 text-yellow-500" />
                                    <span className="text-sm font-bold text-gray-900">{markedQuestions.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Score Card Placeholder (000/300) */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[140px]">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ASSESSMENT SCORE</span>
                        <span className="text-4xl font-black text-gray-200 italic">000/300</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
