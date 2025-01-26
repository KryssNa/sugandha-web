// services/payment.service.ts
import { api } from '@/lib/axios';
import { showToast } from '@/components/shared/toast/showAlet';

interface PaymentResponse {
 success: boolean;
 data?: {
   orderId: string;
   status: string;
   transactionId?: string;
 };
 error?: string;
}

export const verifyPayment = async (
 orderId: string, 
 pidx: string
): Promise<PaymentResponse> => {
 try {
   const response = await api.post('/payments/verify', {
     orderId,
     pidx
   });

   if (response.data.success) {
     return {
       success: true,
       data: response.data.data
     };
   }

   throw new Error(response.data.message);

 } catch (error: any) {
   showToast('error', error.message || 'Payment verification failed');
   return {
     success: false, 
     error: error.message
   };
 }
};

export const initiatePayment = async (paymentData: {
 amount: number;
 method: string;
 orderData: any;
}) => {
 try {
   const response = await api.post('/payments/initiate', paymentData);
   return response.data;
 } catch (error: any) {
   showToast('error', error.message || 'Payment initiation failed');
   throw error;
 }
};