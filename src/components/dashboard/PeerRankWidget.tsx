"use client";

import React from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import { TabButton, DateSelector } from "./Controls";

export function PeerRankWidget() {
    const [activeTab, setActiveTab] = React.useState("Last Month");
    const [userRank, setUserRank] = React.useState({ rank: 23, percentile: 86 });
    const [dateRange, setDateRange] = React.useState({ from: "01.09.2025", to: "01.10.2025" });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        let newRank = { rank: 23, percentile: 86 };
        let newFrom = "01.09.2025";
        let newTo = "01.10.2025";

        if (tab === "Last 3 Months") {
            newRank = { rank: 18, percentile: 89 };
            newFrom = "01.07.2025";
        } else if (tab === "Last 6 Months") {
            newRank = { rank: 12, percentile: 92 };
            newFrom = "01.04.2025";
        }
        setUserRank(newRank);
        setDateRange({ from: newFrom, to: newTo });
    };

    // Exponential curve data mock
    const data = [
        { x: 0, y: 5 }, { x: 10, y: 8 }, { x: 20, y: 12 }, { x: 30, y: 18 },
        { x: 40, y: 26 }, { x: 50, y: 38 }, { x: 60, y: 52 }, { x: 70, y: 68 },
        { x: 80, y: userRank.percentile }, { x: 90, y: 95 }, { x: 100, y: 98 }
    ];

    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col h-[520px] relative w-full">
            <h3 className="text-[16px] font-bold text-gray-800 mb-4">Performance Rank Among Peers</h3>

            <div className="mb-4">
                <DateSelector fromDate={dateRange.from} toDate={dateRange.to} />
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-6">
                {["Last Month", "Last 3 Months", "Last 6 Months"].map((tab) => (
                    <div key={tab}>
                        <TabButton
                            active={activeTab === tab}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </TabButton>
                    </div>
                ))}
            </div>

            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 z-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorY" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="5%" stopColor="#fdba74" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} domain={[0, 100]} ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} tickFormatter={(val) => `${val}%`} />

                            {/* Hidden XAxis to maintain shape */}
                            <XAxis dataKey="x" hide />

                            <Area type="monotone" dataKey="y" stroke="#22d3ee" strokeWidth={3} fill="url(#colorY)" fillOpacity={1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Rank Dot/Arrow */}
                <div className="absolute right-[5px] top-[5%] flex items-center z-10 animate-in fade-in zoom-in duration-500 hidden md:flex">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[12px] font-bold text-[#2dd4bf] italic mb-1">Rank 1 - 98%</span>
                        <div className="h-[1px] w-[200px] bg-[#2dd4bf] relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#2dd4bf] ring-2 ring-white"></div>
                            <ChevronDown className="h-3 w-3 text-[#2dd4bf] absolute -left-1 -top-[5px] rotate-90" />
                        </div>
                    </div>
                </div>

                {/* User Rank Dot/Arrow */}
                <div className="absolute right-[20%] z-10 transition-all duration-500 hidden md:flex" style={{ top: `${100 - userRank.percentile + 5}%` }}>
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[12px] font-bold text-[#3b82f6] italic mb-1">Rank {userRank.rank} - {userRank.percentile}%</span>
                        <div className="h-[1px] w-[250px] bg-[#3b82f6] relative shadow-sm">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#3b82f6] ring-2 ring-white shadow-md"></div>
                            <ChevronDown className="h-3 w-3 text-[#3b82f6] absolute -left-1 -top-[5px] rotate-90" />
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex justify-center mt-4 space-x-6 pb-2">
                <div className="flex items-center text-[11px] font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-[#3b82f6] mr-2"></span> Your Rank</div>
                <div className="flex items-center text-[11px] font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-[#2dd4bf] mr-2"></span> Highest Rank</div>
            </div>
        </div>
    );
}
