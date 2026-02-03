import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { PaperStatData } from "@/types/dashboard";

interface PaperCardProps {
    data: PaperStatData;
}

export function PaperCard({ data }: PaperCardProps) {
    const { title, count, badgeCount, borderColorClass, link } = data;

    return (
        <Link href={link || "/papers"}>
            <div className={cn(
                "bg-white rounded-[24px] p-6 border shadow-sm relative h-[100px] flex flex-col justify-center hover:shadow-md transition-shadow cursor-pointer block",
                borderColorClass ? borderColorClass : "border-gray-100"
            )}>

                <div className="flex justify-between items-start w-full">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                        <div className="flex items-start">
                            <span className="text-[32px] font-bold text-gray-900 leading-none">{count}</span>
                            {badgeCount && (
                                <span className="ml-1 -mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f97316] text-[10px] font-bold text-white shadow-sm border border-white">
                                    {badgeCount}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center -mr-2">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>
        </Link>

    );
}
