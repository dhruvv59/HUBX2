"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronLeft,
    HelpCircle,
    Flag,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    X
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getAssessmentDetail, submitAssessment } from "@/services/assessment"; // Import service
import { AssessmentDetail } from "@/types/assessment"; // Import types

export default function TakeAssessmentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Added Error State
    const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [flagged, setFlagged] = useState<Set<number>>(new Set());
    const [askTeacher, setAskTeacher] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Fetch Assessment Data
    useEffect(() => {
        async function loadAssessment() {
            setIsLoading(true);
            setError(null);
            try {
                // API INTEGRATION POINT: GET /api/assessments/:id
                const data = await getAssessmentDetail(id);
                setAssessment(data);
                setTimeLeft(data.durationSeconds);
            } catch (err) {
                console.error("Failed to load assessment", err);
                setError("Failed to load assessment. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        if (id) {
            loadAssessment();
        }
    }, [id]);

    // Timer Logic
    useEffect(() => {
        if (!assessment || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Auto-submit on timeout could be added here
        return () => clearInterval(timer);
    }, [assessment, timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionId: string) => {
        if (!assessment) return;
        setAnswers(prev => ({
            ...prev,
            [assessment.questions[currentQuestionIndex].id]: optionId
        }));
    };

    // Helper to toggle set membership
    const toggleSetItem = (setter: React.Dispatch<React.SetStateAction<Set<number>>>) => {
        if (!assessment) return;
        const qId = assessment.questions[currentQuestionIndex].id;
        setter(prev => {
            const next = new Set(prev);
            if (next.has(qId)) next.delete(qId);
            else next.add(qId);
            return next;
        });
    };

    const toggleFlag = () => toggleSetItem(setFlagged);
    const toggleAskTeacher = () => toggleSetItem(setAskTeacher);

    const nextQuestion = () => {
        if (!assessment) return;
        if (currentQuestionIndex < assessment.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitClick = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = async () => {
        if (!assessment) return;
        setIsSubmitting(true);
        try {
            // API INTEGRATION POINT: POST /api/assessments/:id/submit
            const result = await submitAssessment(assessment.id, answers);
            console.log("Submitted!", result);
            router.push("/assessments/results");
        } catch (err) {
            console.error("Submission failed", err);
            // In production, show a toast notification here
            setIsSubmitting(false);
            setShowSubmitModal(false);
        }
    };

    // --- RENDER STATES ---

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-500 font-medium">Loading Assessment...</p>
                </div>
            </div>
        );
    }

    if (error || !assessment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Assessment</h2>
                    <p className="text-gray-500 mb-6">{error || "Assessment not found or unavailable."}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = assessment.questions[currentQuestionIndex];
    const totalQuestions = assessment.questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center space-x-4 sticky top-0 z-30">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {assessment.title}
                        <span className="text-sm font-normal text-gray-500 hidden md:inline">
                            ({assessment.subjects.join(", ")})
                        </span>
                    </h1>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-[1600px] mx-auto w-full p-4 lg:p-6 grid grid-cols-12 gap-4 lg:gap-6">

                {/* MOBILE ONLY: Top Timer */}
                <div className="col-span-12 lg:hidden bg-white rounded-[20px] shadow-sm p-4 border border-orange-100 flex justify-between items-center sticky top-[72px] z-20">
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Time Remaining</span>
                    <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                        <Clock className={cn("h-4 w-4 mr-2", timeLeft < 300 ? "text-red-500 animate-pulse" : "")} />
                        <span className={cn("font-mono font-bold text-lg", timeLeft < 300 ? "text-red-600" : "")}>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* LEFT COLUMN: Question List - Desktop */}
                <div className="col-span-1 hidden lg:flex flex-col gap-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
                    {assessment.questions.map((q, idx) => {
                        const isActive = idx === currentQuestionIndex;
                        const isAnswered = answers[q.id];
                        const isFlagged = flagged.has(q.id);

                        return (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={cn(
                                    "h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all relative shrink-0",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : isAnswered
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                {isFlagged && (
                                    <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white" />
                                )}
                                Q{idx + 1}
                            </button>
                        );
                    })}
                </div>

                {/* MIDDLE COLUMN: Question Area */}
                <div className="col-span-12 lg:col-span-8 flex flex-col">
                    <div className="bg-white rounded-[24px] shadow-sm p-5 md:p-8 min-h-[450px] lg:min-h-[600px] flex flex-col relative">
                        {/* Question Header */}
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                                Question {currentQuestionIndex + 1}
                            </span>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleAskTeacher}
                                    className={cn(
                                        "p-2 rounded-full transition-colors",
                                        askTeacher.has(currentQuestion.id) ? "text-orange-500 bg-orange-50" : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                                    )}
                                    title="Ask Teacher"
                                >
                                    <HelpCircle className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={toggleFlag}
                                    className={cn(
                                        "p-2 rounded-full transition-colors",
                                        flagged.has(currentQuestion.id) ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    )}
                                    title="Mark Question"
                                >
                                    <Flag className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Skip">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Question Text */}
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
                            {currentQuestion.text}
                        </h2>

                        {/* Options */}
                        <div className="space-y-4 flex-1">
                            {currentQuestion.options.map((option) => {
                                const isSelected = answers[currentQuestion.id] === option.id;
                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option.id)}
                                        className={cn(
                                            "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group",
                                            isSelected
                                                ? "border-green-400 bg-green-50/50"
                                                : "border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-6 w-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors",
                                            isSelected
                                                ? "border-green-500 bg-green-500"
                                                : "border-gray-300 group-hover:border-gray-400"
                                        )}>
                                            {isSelected && <div className="h-2.5 w-2.5 bg-white rounded-full" />}
                                        </div>
                                        <span className={cn("font-semibold mr-4 text-lg", isSelected ? "text-green-700" : "text-gray-500")}>
                                            {option.id}.
                                        </span>
                                        <span className={cn("text-lg", isSelected ? "text-gray-900 font-medium" : "text-gray-700")}>
                                            {option.text}
                                        </span>
                                        {isSelected && (
                                            <CheckCircle2 className="h-6 w-6 text-green-500 ml-auto" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-center space-x-4 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={prevQuestion}
                                disabled={currentQuestionIndex === 0 || isSubmitting}
                                className="px-8 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Prev
                            </button>

                            {currentQuestionIndex === totalQuestions - 1 ? (
                                <button
                                    onClick={handleSubmitClick}
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Progress & Stats */}
                <div className="col-span-12 lg:col-span-3 space-y-6">

                    {/* Progress Card */}
                    <div className="bg-white rounded-[24px] shadow-sm p-4 lg:p-6 border border-purple-100 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800">Paper Progress</h3>
                            <div className="hidden lg:flex items-center text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg">
                                <Clock className={cn("h-4 w-4 mr-2", timeLeft < 300 ? "text-red-500 animate-pulse" : "")} />
                                <span className={cn("font-mono font-bold", timeLeft < 300 ? "text-red-600" : "")}>{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:space-y-5 lg:gap-0">
                                <div className="flex justify-between items-center group bg-blue-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none border border-blue-100 lg:border-none">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Answered</span>
                                    <span className="font-bold text-gray-800 text-lg">
                                        {answeredCount}<span className="text-gray-400 text-sm font-normal">/{totalQuestions}</span>
                                    </span>
                                </div>
                                <div className="hidden lg:block h-px bg-gray-100" />

                                {/* Total Marks Display instead of Live Score */}
                                <div className="flex justify-between items-center bg-gray-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none border border-gray-100 lg:border-none">
                                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Total Marks</span>
                                    <span className="font-bold text-gray-800 text-lg">{assessment.totalScore}</span>
                                </div>
                                <div className="hidden lg:block h-px bg-gray-100" />

                                <div className="flex justify-between items-center text-gray-500 bg-gray-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none border border-gray-100 lg:border-none">
                                    <div className="flex items-center">
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Doubts</span>
                                        <Flag className="h-3 w-3 ml-2" />
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg">{flagged.size}</span>
                                </div>
                                <div className="hidden lg:block h-px bg-gray-100" />

                                <button
                                    onClick={toggleAskTeacher}
                                    className={cn(
                                        "w-full flex justify-between items-center transition-all p-3 lg:p-0 rounded-xl lg:rounded-none border lg:border-none",
                                        askTeacher.has(currentQuestion.id)
                                            ? "bg-orange-50 border-orange-200 text-orange-600 lg:bg-transparent lg:text-orange-600"
                                            : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 lg:bg-transparent lg:hover:bg-transparent"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Ask Teacher</span>
                                        <HelpCircle className={cn("h-3 w-3 ml-2", askTeacher.has(currentQuestion.id) ? "fill-current" : "")} />
                                    </div>
                                    <span className="font-bold text-lg">{askTeacher.size}</span>
                                </button>
                                <div className="hidden lg:block h-px bg-gray-100" />

                                <button
                                    onClick={toggleFlag}
                                    className={cn(
                                        "col-span-2 lg:col-span-1 w-full flex justify-between items-center transition-all p-3 lg:p-0 rounded-xl lg:rounded-none border lg:border-none",
                                        flagged.has(currentQuestion.id)
                                            ? "bg-red-50 border-red-200 text-red-600 lg:bg-transparent lg:text-red-600"
                                            : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 lg:bg-transparent lg:hover:bg-transparent"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Marked Question</span>
                                        <ChevronRight className="h-3 w-3 ml-2" />
                                    </div>
                                    <span className="font-bold text-lg">{flagged.size}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Submit Assessment?</h3>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600">
                                You have answered <span className="font-bold text-blue-600">{answeredCount}</span> out of <span className="font-bold">{totalQuestions}</span> questions.
                            </p>

                            {answeredCount < totalQuestions && (
                                <div className="bg-orange-50 text-orange-700 p-3 rounded-lg flex items-start text-sm">
                                    <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                                    <p>You have {totalQuestions - answeredCount} unanswered questions. Are you sure you want to finish?</p>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Review Answers
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex justify-center items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Confirm Submit"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
