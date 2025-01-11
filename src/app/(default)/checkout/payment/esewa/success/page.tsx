"use client";
import { api } from "@/lib/axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const PaymentStatusContent = () => {
    const router = useRouter();
    const [status, setStatus] = useState("verifying");
    const searchParams = useSearchParams();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const response = await api.post("/payment/verify", {
                    method: "esewa",
                    pid: searchParams.get("data"),
                    status: "success"
                });

                if (response.data.success) {
                    setStatus("success");
                    setTimeout(() => {
                        router.push(`/checkout/confirmation/${response.data.data.payment.orderId}`);
                    }, 2000);
                } else {
                    setStatus("error");
                }
            } catch (error) {
                setStatus("error");
                console.error("Payment verification failed:", error);
            }
        };

        verifyPayment();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                {status === "verifying" && (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                        <h2 className="text-xl font-semibold">Verifying Payment</h2>
                        <p className="text-gray-600">Please wait while we verify your payment...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <h2 className="text-xl font-semibold">Payment Successful</h2>
                        <p className="text-gray-600">Redirecting to order confirmation...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center space-y-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-xl font-semibold">Payment Failed</h2>
                        <p className="text-gray-600">There was an error processing your payment.</p>
                        <button
                            onClick={() => router.push("/cart")}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Return to Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const PaymentStatus: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentStatusContent />
        </Suspense>
    );
};


export default PaymentStatus;