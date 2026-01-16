"use client";

import React from "react";
import Image from "next/image";
import { Star, HelpCircle, Clock, Users, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { PublicPaper } from "@/types/assessment";

interface PaperCardProps {
    data: PublicPaper;
    onPurchase?: () => void;
    onPreview?: () => void;
    onTeacherClick?: () => void;
    onStartTest?: () => void;
}

export function PaperCard({ data, onPurchase, onPreview, onTeacherClick, onStartTest }: PaperCardProps) {
    const levelColors = {
        Advanced: "bg-red-50 text-red-600 border-red-100",
        Intermediate: "bg-orange-50 text-orange-600 border-orange-100",
        Beginner: "bg-green-50 text-green-600 border-green-100"
    };

    return (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div className="space-y-3 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={data.title}>{data.title}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", levelColors[data.level || "Beginner"])}>
                            {data.level}
                        </span>
                        {data.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {data.badges.includes("FEATURED") && (
                        <span className="px-3 py-1 rounded-lg bg-fuchsia-100 text-fuchsia-700 text-xs font-bold uppercase tracking-wide border border-fuchsia-200">
                            Featured
                        </span>
                    )}
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-sm font-bold border",
                        data.price === 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-[#fefce8] text-[#854d0e] border-yellow-100"
                    )}>
                        ₹ {data.price}
                    </span>
                </div>
            </div>

            {/* Info Metrics Grid */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[13px] text-gray-500 mb-6">
                <div className="flex items-center space-x-1.5 text-orange-500 font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{data.rating}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                    <HelpCircle className="h-4 w-4" />
                    <span>{data.questionCount} Questions</span>
                </div>

                <div className="flex items-center space-x-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{data.durationMinutes} mins</span>
                </div>

                <div className="flex items-center space-x-1.5">
                    <Users className="h-4 w-4" />
                    <span>{data.attempts} Attempts</span>
                </div>

                <div className="flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{data.date}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                    <Tag className="h-4 w-4" />
                    <span>159</span>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full mb-4" />

            {/* Footer / Actions */}
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={onTeacherClick}
                >
                    <div className="relative h-10 w-10 shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100 group-hover:border-[#6366f1] transition-colors">
                            {data.teacher.avatarUrl ? (
                                <Image
                                    src={data.teacher.avatarUrl}
                                    alt={data.teacher.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                    {data.teacher.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#6366f1] transition-colors">{data.teacher.name}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {data.purchased ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPreview?.();
                                }}
                                className="px-5 py-2 rounded-lg text-[#5b5bd6] font-bold text-sm hover:bg-gray-50 transition-colors z-10 relative"
                            >
                                View Questions
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStartTest?.();
                                }}
                                className="px-5 py-2 rounded-lg bg-[#5b5bd6] text-white font-bold text-sm hover:bg-[#4f4fbe] transition-colors shadow-md shadow-indigo-200 z-10 relative"
                            >
                                Start Test
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPreview?.();
                                }}
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors z-10 relative"
                            >
                                Preview
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPurchase?.();
                                }}
                                className="px-5 py-2 rounded-lg bg-[#5b5bd6] text-white font-bold text-sm hover:bg-[#4f4fbe] transition-colors shadow-md shadow-indigo-200 z-10 relative"
                            >
                                Purchase
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
