import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 relative overflow-hidden">
      {/* Background patterns could be added here if needed, keeping it clean for now as per image */}

      <div className="text-center space-y-4 z-10 animate-fade-in-up">
        <h1 className="text-8xl font-bold text-white tracking-tight">HubX</h1>
        <p className="text-xl text-white/90 font-light tracking-wide">intelligence, redefined.</p>
      </div>

      <div className="absolute bottom-10 z-10">
        <Link
          href="/login"
          className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 rounded-full text-white font-medium transition-all"
        >
          Enter Platform
        </Link>
      </div>
    </div>
  );
}
