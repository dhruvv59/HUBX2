"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Calendar, Loader2 } from "lucide-react";
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

type TimePeriod = '1month' | '3months' | '6months' | 'custom';

interface DateRange {
    from: string;
    to: string;
}

interface RevenueChartProps {
    data: ChartDataPoint[];
}

function DatePickerButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
            <Calendar className="w-3 h-3 text-gray-400" />
            {label}
            <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
    );
}

export function RevenueChart({ data: initialData }: RevenueChartProps) {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('1month');
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });
    const [chartData, setChartData] = useState<ChartDataPoint[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data when filters change
    const fetchRevenueData = async (period: TimePeriod, range: DateRange) => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/teacher/dashboard/revenue?period=${period}&from=${range.from}&to=${range.to}`);
            // if (!response.ok) throw new Error('Failed to fetch revenue data');
            // const result = await response.json();
            // setChartData(result.data);

            // For now, simulate API call and filter the initial data
            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter data based on selected period
            let filteredData = [...initialData];
            const monthMap: Record<TimePeriod, number> = {
                '1month': 1,
                '3months': 3,
                '6months': 6,
                'custom': 12 // Default for custom, would be handled by date range
            };

            const monthsToShow = monthMap[period];
            if (period !== 'custom') {
                filteredData = initialData.slice(-monthsToShow);
            }

            setChartData(filteredData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
            console.error('Error fetching revenue data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle time period button click
    const handlePeriodChange = (period: TimePeriod) => {
        setTimePeriod(period);

        // Update date range based on period
        const today = new Date();
        let fromDate: Date;

        switch (period) {
            case '1month':
                fromDate = new Date(today.setMonth(today.getMonth() - 1));
                break;
            case '3months':
                fromDate = new Date(today.setMonth(today.getMonth() - 3));
                break;
            case '6months':
                fromDate = new Date(today.setMonth(today.getMonth() - 6));
                break;
            default:
                return; // Don't update range for custom
        }

        const newRange = {
            from: fromDate.toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0]
        };

        setDateRange(newRange);
        fetchRevenueData(period, newRange);
    };

    // Handle custom date selection
    const handleDateChange = (type: 'from' | 'to', value: string) => {
        const newRange = { ...dateRange, [type]: value };
        setDateRange(newRange);
        setTimePeriod('custom');
        fetchRevenueData('custom', newRange);
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h3 className="text-base font-bold text-gray-800">Revenue Analysis</h3>
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Time Period Buttons */}
                    <div className="flex bg-[#f8f9fa] rounded-lg p-1 border border-gray-100">
                        <button
                            onClick={() => handlePeriodChange('1month')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${timePeriod === '1month'
                                    ? 'bg-[#e0e7ff] text-[#4338ca] shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Last Month
                        </button>
                        <button
                            onClick={() => handlePeriodChange('3months')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${timePeriod === '3months'
                                    ? 'bg-[#e0e7ff] text-[#4338ca] shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Last 3 Months
                        </button>
                        <button
                            onClick={() => handlePeriodChange('6months')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${timePeriod === '6months'
                                    ? 'bg-[#e0e7ff] text-[#4338ca] shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Last 6 Months
                        </button>
                    </div>

                    {/* Date Range Pickers */}
                    <div className="flex items-center gap-2 sm:ml-2">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">From</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => handleDateChange('from', e.target.value)}
                                    max={dateRange.to}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <DatePickerButton label={formatDate(dateRange.from)} onClick={() => { }} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">To</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => handleDateChange('to', e.target.value)}
                                    min={dateRange.from}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <DatePickerButton label={formatDate(dateRange.to)} onClick={() => { }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-[280px] w-full relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                        <Loader2 className="w-8 h-8 text-[#4338ca] animate-spin" />
                    </div>
                )}

                {error ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <p className="text-red-500 font-medium mb-2">Failed to load revenue data</p>
                        <p className="text-sm text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={() => fetchRevenueData(timePeriod, dateRange)}
                            className="px-4 py-2 bg-[#4338ca] text-white text-sm font-medium rounded-lg hover:bg-[#3730a3] transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400 font-medium">No revenue data available for this period</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={36}>
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
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Bar
                                dataKey="value"
                                fill="#5b5fc7"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
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
