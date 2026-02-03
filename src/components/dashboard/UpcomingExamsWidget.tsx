import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { UpcomingExam } from "@/types/dashboard";

interface UpcomingExamsWidgetProps {
    exams: UpcomingExam[];
}

export function UpcomingExamsWidget({ exams }: UpcomingExamsWidgetProps) {
    return (
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-800">Upcoming Exams</h3>
                </div>

                <Link href="/assessments">
                    <button className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 flex items-center">
                        View Schedule <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                </Link>

            </div>

            <div className="space-y-4 flex-1">
                {exams.map((exam) => (
                    <div key={exam.id} className="flex gap-4 items-start group">
                        {/* Date Box */}
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 border border-gray-200 min-w-[50px]">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{exam.date.split(" ")[1]}</span>
                            <span className="text-xl font-bold text-gray-900 leading-none">{exam.date.split(" ")[0]}</span>
                        </div>

                        <div className="flex-1 mt-0.5">
                            <h4 className="text-[13px] font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                {exam.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                    exam.type === 'Mock Test' ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                                )}>
                                    {exam.type}
                                </span>
                                <span className="text-[11px] text-gray-500 flex items-center font-medium">
                                    <Clock className="h-3 w-3 mr-1 opacity-70" /> {exam.time}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-[11px] text-center text-gray-400 font-medium">
                    You have <span className="text-gray-700 font-bold">2 tests</span> scheduled this week.
                </p>
            </div>
        </div>
    );
}
