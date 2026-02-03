"use client";

import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from "recharts";
import { ChartDataPoint } from "@/types/dashboard";
import { TabButton, DateSelector } from "./Controls";

interface PerformanceChartProps {
    initialData: ChartDataPoint[];
}

export function PerformanceChart({ initialData }: PerformanceChartProps) {
    const [activeTab, setActiveTab] = React.useState("Last Month");
    const [data, setData] = React.useState(initialData);
    const [dateRange, setDateRange] = React.useState({
        from: "01.09.2025",
        to: "01.10.2025"
    });
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // In a real app, this would trigger an API call
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        let newData = [...initialData];
        let newFrom = "01.09.2025";
        let newTo = "01.10.2025";

        if (tab === "Last 3 Months") {
            // Simulate data change
            newData = newData.map(item => ({
                ...item,
                score: Math.min(100, Math.max(0, item.score + Math.floor(Math.random() * 20 - 10)))
            }));
            newFrom = "01.07.2025";
        } else if (tab === "Last 6 Months") {
            newData = newData.map(item => ({
                ...item,
                score: Math.min(100, Math.max(0, item.score + Math.floor(Math.random() * 30 - 15)))
            }));
            newFrom = "01.04.2025";
        }
        setData(newData);
        setDateRange({ from: newFrom, to: newTo });
    };

    const handleFromDateChange = (newDate: string) => {
        setDateRange(prev => ({ ...prev, from: newDate }));
        setActiveTab(""); // Clear active tab when manually selecting date
        // In a real app, fetch new data based on date range here
    };

    const handleToDateChange = (newDate: string) => {
        setDateRange(prev => ({ ...prev, to: newDate }));
        setActiveTab(""); // Clear active tab when manually selecting date
        // In a real app, fetch new data based on date range here
    };

    return (
        <div className="bg-white rounded-[24px] p-6 shadow-sm w-full">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <h3 className="text-[16px] font-bold text-gray-800 whitespace-nowrap">Performance Analysis</h3>
                    <div className="flex flex-wrap gap-2 items-center">
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
                </div>
                <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <DateSelector
                        fromDate={dateRange.from}
                        toDate={dateRange.to}
                        onFromChange={handleFromDateChange}
                        onToChange={handleToDateChange}
                    />
                </div>
            </div>

            <div className="h-[320px] w-full mt-4 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={isMobile ? 24 : 40} margin={{ bottom: isMobile ? 60 : 25 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            tick={(props) => {
                                const { x, y, payload } = props;
                                const isLong = payload.value.length > 10;
                                const displayName = isMobile && isLong ? `${payload.value.substring(0, 8)}...` : payload.value;

                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            transform="rotate(-90)"
                                            x={0}
                                            y={isMobile ? -10 : -28}
                                            textAnchor="end"
                                            fill="#6b7280"
                                            fontSize={11}
                                            fontWeight={500}
                                            dy={isMobile ? 5 : 0}
                                        >
                                            {displayName}
                                        </text>
                                        {!isMobile && (
                                            <text
                                                x={0}
                                                y={20}
                                                textAnchor="middle"
                                                fill="#9ca3af"
                                                fontSize={10}
                                            >
                                                12 Tests
                                            </text>
                                        )}
                                    </g>
                                );
                            }}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} tickFormatter={(value) => `${value}%`} />
                        <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${value}%`, 'Score']} />
                        <Bar dataKey="score" radius={[6, 6, 6, 6]} label={{ position: 'top', fill: '#1f2937', fontSize: 12, fontWeight: 'bold', formatter: (val: any) => `${val}%` }}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
