import React from "react";
import { Users } from "lucide-react";

export default function TeachersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">Add Teacher</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-white border border-border rounded-xl shadow-sm">
                        <div className="h-12 w-12 rounded-full bg-gray-200" />
                        <div>
                            <h3 className="font-semibold">Sarah Wilson</h3>
                            <p className="text-sm text-muted-foreground">Mathematics • Class 10</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
