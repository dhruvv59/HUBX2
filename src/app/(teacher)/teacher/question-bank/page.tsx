"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Loader2, HelpCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuestionBankFilters } from "@/components/teacher/question-bank/QuestionBankFilters";
import { QuestionBankList } from "@/components/teacher/question-bank/QuestionBankList";
import { SuccessToast } from "@/components/ui/SuccessToast";
import { getDraft, addQuestionToDraft } from "@/services/draft-service";
import { getBankQuestions } from "@/services/question-bank-service";
import { PaperConfig, Question } from "@/types/generate-paper";

function QuestionBankPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const draftId = searchParams.get("draftId");

    const [config, setConfig] = useState<PaperConfig | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // Filters State
    const [filters, setFilters] = useState({
        subject: "Science",
        difficulty: "Intermediate",
        rating: "4star",
        addedTime: "Latest"
    });

    // Selection State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch draft if accessible (optional context)
                if (draftId) {
                    const data = await getDraft(draftId);
                    if (data) setConfig(data);
                }

                // Fetch Questions
                const bankQuestions = await getBankQuestions({
                    ...filters,
                    difficulty: filters.difficulty === "All" ? [] : [filters.difficulty]
                });
                setQuestions(bankQuestions);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, [draftId]);

    // Re-fetch on filter change (mocked)
    useEffect(() => {
        const refetch = async () => {
            const bankQuestions = await getBankQuestions({
                ...filters,
                difficulty: filters.difficulty === "All" ? [] : [filters.difficulty]
            });
            setQuestions(bankQuestions);
        }
        refetch();
    }, [filters]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleAddQuestions = async () => {
        if (!draftId) {
            alert("No active draft to add questions to.");
            return;
        }

        setIsAdding(true);
        try {
            const selectedQuestions = questions.filter(q => selectedIds.includes(q.id));
            // Simulate adding questions with a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            for (const q of selectedQuestions) {
                await addQuestionToDraft(draftId, q);
            }

            setToastMessage(`Added ${selectedQuestions.length} questions to draft!`);
            setShowToast(true);

            // Delay navigation slightly to show toast
            setTimeout(() => {
                router.back();
            }, 1000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#6366f1] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1300px] mx-auto pb-20 pt-10 px-6">
            <SuccessToast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        {draftId && (
                            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 transition-colors">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}
                        {!draftId && (
                            <div className="w-10 h-10 rounded-full bg-[#f3e8ff] flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-[#9333ea]" />
                            </div>
                        )}
                        <h1 className="text-2xl font-bold text-gray-900">
                            {config?.title || "Question Bank"}
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-9 font-medium">Discover and add questions from the question bank</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <QuestionBankFilters filters={filters} onFilterChange={handleFilterChange} />
                <QuestionBankList
                    questions={questions}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onAddQuestions={handleAddQuestions}
                    isAdding={isAdding}
                />
            </div>
        </div>
    );
}

export default function QuestionBankPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 text-[#6366f1] animate-spin" /></div>}>
            <QuestionBankPageContent />
        </Suspense>
    );
}
