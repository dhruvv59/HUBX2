import React from "react";
import { BookOpen } from "lucide-react";

export default function PapersPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Public Papers</h2>
            <p className="text-muted-foreground max-w-sm">
                Browse and access public research papers and resources. This module is currently under development.
            </p>
        </div>
    );
}
