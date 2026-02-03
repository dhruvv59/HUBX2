import Link from "next/link";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurchasedPapersCardProps {
    count: number;
}

/**
 * Purchased Papers Card - Shows on dashboard only when student has purchased papers
 * Provides quick access to purchased papers page
 */
export function PurchasedPapersCard({ count }: PurchasedPapersCardProps) {
    return (
        <Link href="/papers/purchased">
            <div className={cn(
                "bg-white rounded-[24px] p-6 border shadow-sm relative h-[100px] flex flex-col justify-center hover:shadow-md transition-shadow cursor-pointer block",
                "border-purple-200 hover:border-purple-300"
            )}>
                <div className="flex justify-between items-start w-full">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            PURCHASED PAPERS
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[32px] font-bold text-gray-900 leading-none">
                                {count}
                            </span>
                            <ShoppingCart className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">
                            Your owned papers
                        </p>
                    </div>
                    <div className="h-8 w-8 rounded-full border border-purple-200 flex items-center justify-center -mr-2 bg-purple-50">
                        <ChevronRight className="h-4 w-4 text-purple-500" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
