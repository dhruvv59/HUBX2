import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-border/20">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden pl-0 md:pl-[100px]">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#fafafa]">
                    {children}
                </main>
            </div>
        </div>
    );
}
