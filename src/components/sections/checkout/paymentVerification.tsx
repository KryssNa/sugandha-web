// components/checkout/PaymentVerification.tsx
'use client';

import { verifyPayment } from '@/services/payment.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentVerification() {
  const router = useRouter();
  const { orderId, status, pidx } = router.query;

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await verifyPayment(orderId as string, pidx as string);
        if (result.success) {
          router.push(`/checkout/confirmation/${orderId}?status=success`);
        } else {
          router.push(`/checkout/confirmation/${orderId}?status=failed`);
        }
      } catch (error) {
        router.push(`/checkout/confirmation/${orderId}?status=failed`);
      }
    };

    if (orderId && status) {
      verify();
    }
  }, [orderId, status, pidx, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    </div>
  );
}