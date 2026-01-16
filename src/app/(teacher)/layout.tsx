
import { TeacherHeader } from "@/components/layout/TeacherHeader";
import { TeacherSidebar } from "@/components/layout/TeacherSidebar";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#fafafa]">
            {/* Fixed Sidebar */}
            <TeacherSidebar />

            {/* Main Content Wrapper */}
            <div className="flex flex-1 flex-col overflow-hidden pl-0 md:pl-[100px]">
                {/* Header */}
                <TeacherHeader />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
