"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaperSummaryCard } from "@/components/teacher/ai/PaperSummaryCard";
import { AiGeneratorForm } from "@/components/teacher/ai/AiGeneratorForm";
import { AddedQuestionsList } from "@/components/teacher/ai/AddedQuestionsList";
import { PublishConfirmModal } from "@/components/teacher/ai/PublishConfirmModal";
import { PublishSuccessModal } from "@/components/teacher/ai/PublishSuccessModal";
import { getDraft, addQuestionToDraft, removeQuestionFromDraft } from "@/services/draft-service";
import { PaperConfig, Question } from "@/types/generate-paper";

function AiGeneratorPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const draftId = searchParams.get("draftId");

    const [config, setConfig] = useState<PaperConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        const fetchDraft = async () => {
            if (!draftId) {
                router.push("/teacher/ai-assessments");
                return;
            }
            try {
                const data = await getDraft(draftId);
                if (data) setConfig(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDraft();
    }, [draftId, router]);

    const handleGenerate = async (count: number, instructions: string) => {
        if (!draftId) return;
        setIsGenerating(true);
        try {
            // Simulate AI Generation Delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock Generated Questions
            const subjectContent = config?.subject === "Mathematics"
                ? ["Calculate the area of a circle radius 5cm", "Solve quadratic equation x^2 - 4x + 4 = 0"]
                : ["Explain Photosynthesis", "Define kinetic energy"];

            const newQuestions: Question[] = Array.from({ length: count }).map((_, i) => ({
                id: `q-ai-${Date.now()}-${i}`,
                type: "Text",
                difficulty: config?.difficulty || "Intermediate",
                content: subjectContent[i % subjectContent.length] + ` (Generative Variation ${i + 1})`,
                solution: "This is an AI generated comprehensive model solution based on the provided constraints.",
                marks: 5
            }));

            // Add questions sequentially
            for (const q of newQuestions) {
                await addQuestionToDraft(draftId, q);
            }

            const updated = await getDraft(draftId);
            if (updated) setConfig(updated);
            alert(`AI successfully generated ${count} questions!`);

        } catch (error) {
            console.error("AI Generation failed", error);
            alert("Failed to generate questions. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRemoveQuestion = async (id: string) => {
        if (!draftId) return;
        try {
            await removeQuestionFromDraft(draftId, id);
            const updated = await getDraft(draftId);
            if (updated) setConfig(updated);
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmPublish = async () => {
        setIsPublishing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsPublishModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsPublishing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#6366f1] animate-spin" />
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="max-w-[1300px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Generate Paper</h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-9 font-medium">Discover and access quality papers created by expert teachers</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-10 px-6 rounded-lg border border-gray-300 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors">
                        Save Question Paper
                    </button>
                    <button
                        onClick={() => setIsPublishModalOpen(true)}
                        className="h-10 px-6 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition-colors shadow-sm"
                    >
                        Publish Paper
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Sidebar Summary */}
                <div className="w-full lg:w-[320px] shrink-0">
                    <PaperSummaryCard config={config} showChaptersList={true} />
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full">
                    {/* Dynamic Title */}
                    <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 p-6">
                        <h2 className="text-lg font-bold text-[#5b5bd6]">
                            {config.title}
                        </h2>
                    </div>

                    {/* AI Generator Form */}
                    <AiGeneratorForm
                        config={config}
                        onGenerate={handleGenerate}
                        onCancel={() => router.back()}
                        isGenerating={isGenerating}
                    />

                    {/* Added Questions List */}
                    <div className="mt-8">
                        <AddedQuestionsList
                            questions={config.questions || []}
                            onRemove={handleRemoveQuestion}
                        />
                    </div>
                </div>
            </div>

            <PublishConfirmModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onConfirm={handleConfirmPublish}
                isPublishing={isPublishing}
            />

            <PublishSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </div>
    );
}

export default function AiGeneratorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 text-[#6366f1] animate-spin" /></div>}>
            <AiGeneratorPageContent />
        </Suspense>
    );
}
