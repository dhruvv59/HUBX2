"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    paperTitle: string;
    amount: number;
    onSuccess: () => void;
}

type PaymentMethod = "UPI" | "Card";

export function PaymentModal({ isOpen, onClose, paperTitle, amount, onSuccess }: PaymentModalProps) {
    const [method, setMethod] = useState<PaymentMethod>("UPI");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsProcessing(false);
        setIsSuccess(true);

        // Auto close or notify parent after success view
        // Keeping it open to show success message as per design
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-[24px] w-full max-w-[500px] p-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-6 w-6 text-white stroke-[3]" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-green-500 mb-2">Payment Successful</h2>
                    <p className="text-center text-gray-500 font-medium mb-8">
                        You can access the paper<br />
                        <span className="text-gray-900 font-bold">"{paperTitle}"</span>
                    </p>

                    {/* Assuming auto-redirect or close, but let's add a close button for UX */}
                    <button
                        onClick={onSuccess}
                        className="w-full py-3 rounded-xl bg-[#6366f1] text-white font-bold hover:bg-[#4f4fbe] transition-colors"
                    >
                        View Paper
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] w-full max-w-[600px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Complete Purchase</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Summary */}
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-medium text-gray-700">{paperTitle}</span>
                    <span className="font-bold text-lg text-gray-900">Total Amount : ₹ {amount}</span>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Select payment method</h3>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        {(["UPI", "Card"] as PaymentMethod[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMethod(m)}
                                className={cn(
                                    "flex-1 pb-3 text-sm font-bold transition-all relative",
                                    method === m ? "text-[#5b5bd6]" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {m}
                                {method === m && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b5bd6]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="border border-[#6366f1] rounded-xl p-6 bg-blue-50/10">
                        {method === "UPI" && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700">UPI ID</label>
                                <input
                                    type="text"
                                    placeholder="example@upi"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                                />
                            </div>
                        )}

                        {method === "Card" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700">Card No</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="space-y-2 flex-1">
                                        <label className="text-xs font-bold text-gray-700">Expiry (MM/DD)</label>
                                        <input
                                            type="text"
                                            placeholder="MM/DD"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                                        />
                                    </div>
                                    <div className="space-y-2 w-1/3">
                                        <label className="text-xs font-bold text-gray-700">CVV</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 mt-8 justify-end">
                            <button
                                onClick={onClose}
                                className="px-8 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="px-8 py-2.5 rounded-lg bg-[#5b5bd6] text-white font-bold hover:bg-[#4f4fbe] transition-colors shadow-md shadow-indigo-200 min-w-[140px] flex justify-center"
                            >
                                {isProcessing ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    `Pay ₹ ${amount}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
