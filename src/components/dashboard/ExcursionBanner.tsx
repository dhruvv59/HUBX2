import { ChevronRight, Compass } from "lucide-react";

export function ExcursionBanner() {
    return (
        <div className="rounded-[24px] p-5 flex items-center justify-between border border-blue-100 shadow-sm h-[100px]"
            style={{ background: "linear-gradient(90deg, #FDF4FF 0%, #ECFCCB 50%, #E0F2FE 100%)" }}>
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md border-[3px] border-white/50">
                    <Compass className="h-6 w-6" />
                </div>
                <span className="font-extrabold text-[#1f2937] italic text-lg tracking-wide max-w-md">APPROVED EXCURSION - GLENMARK PVT. LTD.</span>
            </div>
            <div className="h-10 w-10 rounded-full border border-black/5 bg-white/40 flex items-center justify-center cursor-pointer hover:bg-white transition-colors backdrop-blur-sm">
                <ChevronRight className="h-5 w-5 text-gray-700" />
            </div>
        </div>
    );
}
