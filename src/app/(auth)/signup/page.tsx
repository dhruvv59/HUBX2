"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);

        // Mock OTP call
        setTimeout(() => {
            setIsLoading(false);
            // Logic for OTP would go here
            router.push("/dashboard");
        }, 1000);
    }

    return (
        <div className="bg-white rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <Link href="/" className="absolute top-6 right-6 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X className="h-6 w-6 text-black" />
            </Link>

            <div className="flex flex-col items-center space-y-6 pt-2">
                {/* Logo */}
                <div className="relative w-48 h-12">
                    <Image
                        src="/assets/images/logo-full.svg"
                        alt="Lernen Hub"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <h1 className="text-xl text-gray-800 font-normal">Create account to get started!</h1>

                <form onSubmit={onSubmit} className="w-full space-y-6 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500" htmlFor="email">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            className="w-full h-12 px-4 rounded-lg bg-gray-100 border-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="flex items-start space-x-2">
                        <input
                            id="terms"
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-500 leading-tight">
                            By signing up you <Link href="/terms" className="underline font-medium text-gray-700">agree to terms & conditions<span className="text-red-500">*</span></Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-lg bg-blue-400 text-white font-semibold text-lg shadow-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get OTP"}
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <Link href="/login">
                        <div className="w-full h-12 rounded-lg border border-gray-200 flex items-center justify-center text-gray-900 font-medium hover:bg-gray-50 transition-colors">
                            Already have an account? Login
                        </div>
                    </Link>
                </form>
            </div>
        </div>
    );
}
