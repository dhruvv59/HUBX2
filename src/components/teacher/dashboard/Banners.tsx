"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

export function Banners() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Large Banner: Excursion - Improved Gradient */}
            <Link href="/teacher/excursion" className="lg:col-span-2">
                <div className="h-[110px] relative overflow-hidden rounded-2xl bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-yellow-100 via-blue-100 to-red-100 flex items-center px-8 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                    <div className="z-10 flex items-center gap-6 w-full justify-between">
                        <div className="flex items-center gap-5">
                            {/* Custom Compass Icon Circle */}
                            <div className="h-12 w-12 rounded-full border-[2.5px] border-black flex items-center justify-center bg-transparent">
                                <div className="h-2.5 w-2.5 rounded-sm bg-black rotate-45"></div>
                            </div>
                            <span className="text-lg font-black text-gray-900 italic tracking-wider">
                                APPROVED EXCURSION - GLENMARK PVT. LTD.
                            </span>
                        </div>

                        <div className="h-10 w-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white transition-all">
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Small Banner: AI Generator - Purple Border */}
            <Link href="/teacher/ai-assessments">
                <div className="h-[110px] bg-white rounded-2xl border-[1.5px] border-[#e9d5ff] p-6 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-start">
                            <h3 className="text-xl font-black italic text-gray-900 leading-none">
                                AI SMART <br /> GENERATOR
                            </h3>
                            <Sparkles className="w-6 h-6 text-[#c084fc] ml-2 fill-current" />
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center bg-white z-10 hover:border-black transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-500 hover:text-black" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
