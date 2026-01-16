"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { ChartDataPoint } from "@/types/teacher";

function DropdownFilter({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            {label}
            <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
    );
}

export function RevenueChart({ data }: { data: ChartDataPoint[] }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h3 className="text-base font-bold text-gray-800">Revenue Analysis</h3>
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex bg-[#f8f9fa] rounded-lg p-1 border border-gray-100">
                        <button className="px-3 py-1 bg-[#e0e7ff] text-[#4338ca] text-[10px] font-bold rounded-md shadow-sm">Last Month</button>
                        <button className="px-3 py-1 text-gray-500 text-[10px] font-bold hover:bg-gray-200 rounded-md transition-colors">Last 3 Months</button>
                        <button className="px-3 py-1 text-gray-500 text-[10px] font-bold hover:bg-gray-200 rounded-md transition-colors">Last 6 Months</button>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-2">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">From</span>
                            <DropdownFilter label="01.09.2025" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">To</span>
                            <DropdownFilter label="01.10.2025" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={36}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            cursor={{ fill: '#4f46e5', opacity: 0.05 }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px -5px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
                            itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#5b5fc7"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function RevenueChartSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px] animate-pulse">
            <div className="flex justify-between mb-8">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-[250px] bg-gray-100 rounded"></div>
        </div>
    );
}
