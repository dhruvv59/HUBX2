import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const TabButton = ({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "px-4 py-1.5 text-[11px] font-semibold rounded-full transition-colors border",
            active ? "border-[#c4b5fd] text-[#7c3aed] bg-[#f5f3ff]" : "bg-white text-gray-400 hover:text-gray-600 border-gray-200"
        )}>
        {children}
    </button>
);

export const DateSelector = ({ fromDate, toDate }: { fromDate: string, toDate: string }) => (
    <div className="flex items-center space-x-2">
        <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden shadow-sm">
            <span className="text-[11px] text-gray-500 font-medium px-3 py-1.5 bg-gray-50 border-r border-gray-200">From</span>
            <div className="px-3 py-1.5 text-[12px] font-bold text-[#1f2937] flex items-center cursor-pointer hover:bg-gray-50 min-w-[100px] justify-between">
                {fromDate} <ChevronDown className="h-3 w-3 ml-2 text-gray-400" />
            </div>
        </div>
        <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden shadow-sm">
            <span className="text-[11px] text-gray-500 font-medium px-3 py-1.5 bg-gray-50 border-r border-gray-200">To</span>
            <div className="px-3 py-1.5 text-[12px] font-bold text-[#1f2937] flex items-center cursor-pointer hover:bg-gray-50 min-w-[100px] justify-between">
                {toDate} <ChevronDown className="h-3 w-3 ml-2 text-gray-400" />
            </div>
        </div>
    </div>
);
