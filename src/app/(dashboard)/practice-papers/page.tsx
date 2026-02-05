
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { practicePaperService } from "@/services/practice-paper";
import { PracticePapersClient } from "@/components/practice-paper/PracticePapersClient";
import { ErrorBoundary, ErrorFallback } from "@/components/common/ErrorBoundary";

/**
 * ASYNC CONTENT WRAPPER
 */
async function PracticePapersContainer() {
    const response = await practicePaperService.getPapers({ page: 1, limit: 9 });

    // Handle error or empty state if needed - assuming success for now based on service
    if (!response.success) {
        throw new Error("Failed to load practice papers");
    }

    // Transform response for client component props
    // Note: The service returns data in a structured way
    const { papers, stats, pagination } = response.data;

    return <PracticePapersClient initialData={{ papers, stats, pagination }} />;
}

/**
 * PRACTICE PAPERS SERVER PAGE
 */
export default function PracticePapersPage() {
    return (
        <ErrorBoundary fallback={<ErrorFallback message="Failed to load practice papers" />}>
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        <p className="text-gray-500 font-medium animate-pulse">Loading Practice Papers...</p>
                    </div>
                }
            >
                <PracticePapersContainer />
            </Suspense>
        </ErrorBoundary>
    );
}
