"use client";

import React from "react";
import { Bell, Search, User } from "lucide-react";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
            <div className="flex items-center w-96">
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Search assessments, papers..."
                    />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border border-primary/20">
                    <span className="sr-only">User Menu</span>
                    <User className="h-5 w-5" />
                </div>
            </div>
        </header>
    );
}
