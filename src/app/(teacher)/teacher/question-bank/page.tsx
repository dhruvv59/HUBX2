import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getDraft } from "@/services/draft-service";
import { getBankQuestions } from "@/services/question-bank-service";
import { QuestionBankClient } from "@/components/teacher/question-bank/QuestionBankClient";
import { ErrorBoundary, ErrorFallback } from "@/components/common/ErrorBoundary";

/**
 * ASYNC CONTENT WRAPPER
 */
async function QuestionBankContainer({ searchParams }: { searchParams: { draftId?: string } }) {
    const draftId = searchParams.draftId;

    // Parallel fetching
    const [draftData, bankQuestions] = await Promise.all([
        draftId ? getDraft(draftId) : Promise.resolve(null),

        getBankQuestions({
            subject: "Science",
            difficulty: ["Intermediate"],
            rating: "4star",
            addedTime: "Latest",
            search: ""
        })
    ]);

    return <QuestionBankClient initialConfig={draftData} initialQuestions={bankQuestions} />;
}

/**
 * QUESTION BANK SERVER PAGE
 */
export default function QuestionBankPage({
    searchParams,
}: {
    searchParams: { draftId?: string };
}) {
    return (
        <ErrorBoundary fallback={<ErrorFallback message="Failed to load question bank" />}>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-[#6366f1] animate-spin" />
                    </div>
                }
            >
                <QuestionBankContainer searchParams={searchParams} />
            </Suspense>
        </ErrorBoundary>
    );
}
