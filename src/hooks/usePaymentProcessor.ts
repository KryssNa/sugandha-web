// hooks/usePaymentProcessor.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/shared/toast/showAlet';

export const usePaymentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const initializePayment = async ({ amount, method }: { amount: number; method: string }) => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, paymentMethod: method })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      if (method === 'cod') {
        return { success: true };
      }

      // For digital payments, handle redirect
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentUrl;

      Object.entries(data.formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      return { success: true };

    } catch (error) {
      console.error('Payment error:', error);
      showToast('error', 'Payment failed. Please try again.');
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  return { initializePayment, isProcessing };
};

export const usePayment = () => {
  const initiatePayment = async ({ amount, method, orderData }: { amount: number; method: string; orderData: any }) => {
    const response = await fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, paymentMethod: method, orderData })
    });

    if (!response.ok) {
      throw new Error('Payment initiation failed');
    }

    return response.json();
  };

  return { initiatePayment };
};