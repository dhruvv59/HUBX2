"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import { TabButton, DateSelector } from "./Controls";
import { SubjectPerformanceData } from "@/types/dashboard";

interface SubjectPerformanceWidgetProps {
    data: SubjectPerformanceData;
}

export function SubjectPerformanceWidget({ data }: SubjectPerformanceWidgetProps) {
    const [activeTab, setActiveTab] = React.useState("Last Month");
    const [selectedSubject, setSelectedSubject] = React.useState(data.currentSubject);
    const [dateRange, setDateRange] = React.useState({ from: "01.09.2025", to: "01.10.2025" });
    const [chartMetrics, setChartMetrics] = React.useState(data.metrics);

    // In a real app, changing tabs/dates would trigger a new data fetch
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        let newFrom = "01.09.2025";
        const newTo = "01.10.2025";

        let newMetrics = [...data.metrics];

        if (tab === "Last 3 Months") {
            newFrom = "01.07.2025";
            newMetrics = newMetrics.map(m => ({
                ...m,
                score: Math.min(100, Math.max(0, m.score + Math.floor(Math.random() * 20 - 10)))
            }));
        } else if (tab === "Last 6 Months") {
            newFrom = "01.04.2025";
            newMetrics = newMetrics.map(m => ({
                ...m,
                score: Math.min(100, Math.max(0, m.score + Math.floor(Math.random() * 30 - 15)))
            }));
        } else {
            // Reset
            newMetrics = data.metrics;
        }

        setChartMetrics(newMetrics);
        setDateRange({ from: newFrom, to: newTo });
    };

    const handleFromDateChange = (newDate: string) => {
        setDateRange(prev => ({ ...prev, from: newDate }));
        setActiveTab("");
    };

    const handleToDateChange = (newDate: string) => {
        setDateRange(prev => ({ ...prev, to: newDate }));
        setActiveTab("");
    };

    // Find metrics for selected subject or default to first
    const currentMetric = chartMetrics.find(m => m.subject === selectedSubject) || chartMetrics[0];
    const percentage = currentMetric ? currentMetric.score : 0;
    const color = currentMetric ? currentMetric.color : "#e5e7eb";

    const chartData = [
        { name: "Completed", value: percentage, color: color },
        { name: "Remaining", value: 100 - percentage, color: "#f3f4f6" },
    ];

    return (
        <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm flex flex-col h-[520px] w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                <h3 className="text-[16px] font-bold text-gray-800">Performance by Subject</h3>

                {/* Dropdown for Subjects */}
                <div className="relative group w-full sm:w-auto">
                    <button className="text-[12px] font-bold text-blue-600 flex items-center justify-between w-full sm:w-auto bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                        {selectedSubject} <ChevronDown className="h-3 w-3 ml-1" />
                    </button>
                    {/* Simple Dropdown Content */}
                    <div className="absolute right-0 top-full mt-2 w-full sm:w-40 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block z-20 p-1">
                        {data.metrics.map(metric => (
                            <div
                                key={metric.subject}
                                onClick={() => setSelectedSubject(metric.subject)}
                                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg cursor-pointer font-medium"
                            >
                                {metric.subject}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <DateSelector
                    fromDate={dateRange.from}
                    toDate={dateRange.to}
                    onFromChange={handleFromDateChange}
                    onToChange={handleToDateChange}
                />
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-6">
                {["Last Month", "Last 3 Months", "Last 6 Months"].map((tab) => (
                    <TabButton
                        key={tab}
                        active={activeTab === tab}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </TabButton>
                ))}
            </div>

            <div className="flex-1 relative flex items-center justify-center min-h-[250px] lg:min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius="65%"
                            outerRadius="90%"
                            paddingAngle={0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[36px] lg:text-[56px] font-black italic" style={{ color: "#1f2937" }}>{percentage}%</span>
                </div>
            </div>
        </div>
    );
}
