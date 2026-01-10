"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import { TabButton, DateSelector } from "./Controls";

export function SubjectPerformanceWidget() {
    const [activeTab, setActiveTab] = React.useState("Last Month");
    const [percentage, setPercentage] = React.useState(58);
    const [dateRange, setDateRange] = React.useState({ from: "01.09.2025", to: "01.10.2025" });

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        let newPerc = 58;
        let newFrom = "01.09.2025";
        let newTo = "01.10.2025";

        if (tab === "Last 3 Months") {
            newPerc = 64;
            newFrom = "01.07.2025";
        } else if (tab === "Last 6 Months") {
            newPerc = 71;
            newFrom = "01.04.2025";
        }
        setPercentage(newPerc);
        setDateRange({ from: newFrom, to: newTo });
    };

    const subjectData = [
        { name: "Completed", value: percentage, color: "#fde047" }, // Yellow
        { name: "Remaining", value: 100 - percentage, color: "#e5e7eb" }, // Grey
    ];

    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col h-[520px] w-full">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-[16px] font-bold text-gray-800">Performance by Subject</h3>
                <button className="text-[12px] font-bold text-blue-600 flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    Social Science <ChevronDown className="h-3 w-3 ml-1" />
                </button>
            </div>

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

            <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={subjectData}
                            innerRadius={100}
                            outerRadius={135}
                            paddingAngle={0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {subjectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[56px] font-black text-[#1f2937] italic">{percentage}%</span>
                </div>
            </div>
        </div>
    );
}
