"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PaperConfig } from "@/types/generate-paper";
import { GeneratePaperForm } from "@/components/teacher/ai/GeneratePaperForm";
import { PaperSummaryCard } from "@/components/teacher/ai/PaperSummaryCard";
import { saveDraft } from "@/services/draft-service";

const INITIAL_CONFIG: PaperConfig = {
    title: "Science Intermediate Paper 2025",
    standard: "Standard 9th",
    subject: "Science",
    difficulty: "Intermediate",
    chapters: [
        { id: "c1", name: "Mechanics", selected: false },
        { id: "c2", name: "Thermodynamics", selected: false },
        { id: "c3", name: "Electricity", selected: false },
        { id: "c4", name: "Modern Physics", selected: false },
        { id: "c5", name: "Optics", selected: false },
        { id: "c6", name: "Magnetism", selected: false },
    ],
    isTimeBound: true,
    isPublic: true,
    duration: 60,
    price: 450
};

export default function GeneratePaperPage() {
    const router = useRouter();
    const [config, setConfig] = useState<PaperConfig>(INITIAL_CONFIG);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddQuestion = async () => {
        setIsSubmitting(true);
        try {
            const draftId = await saveDraft(config);
            router.push(`/teacher/ai/create?draftId=${draftId}`);
        } catch (error) {
            console.error("Failed to save draft", error);
            setIsSubmitting(false); // Only reset on error, otherwise we navigate away
        }
    };

    return (
        <div className="max-w-[1300px] mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Generate Paper</h1>
                </div>
                <p className="text-gray-500 text-sm ml-9 font-medium">Generate intelligent papers from multiple materials using advanced AI</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Main Form */}
                <div className="flex-1 w-full">
                    <GeneratePaperForm
                        config={config}
                        onChange={setConfig}
                        onAddQuestion={handleAddQuestion}
                        isSubmitting={isSubmitting}
                    />
                </div>

                {/* Sidebar Summary */}
                <div className="w-full lg:w-[350px] shrink-0">
                    <PaperSummaryCard config={config} />
                </div>
            </div>
        </div>
    );
}
