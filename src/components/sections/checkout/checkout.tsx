"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ConfirmationPage from "./confirmationPage";
import { OrderSummaryItem } from "./orderSummary";
import { PaymentForm } from "./paymentForm";
import { PriceBreakdown } from "./priceBreakdown";
import { ProgressSteps } from "./progressStep";
import { ShippingForm } from "./shippingForm";
import { TopBanner } from "./topBanner";
import { TrustBadges } from "./trustBadge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStep, setFormData, setOrderSummary, CheckoutFormData as CustomFormData } from "@/store/slices/checkoutSlice";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const { step, formData, orderSummary } = useAppSelector((state) => state.checkout);

  // Initialize with sample data (in real app, this would come from cart)
  useEffect(() => {
    dispatch(setOrderSummary({
      subtotal: 199.99,
      shipping: 10.0,
      tax: 20.0,
      total: 229.99,
      items: [
        {
          id: "1",
          name: "Premium Perfume",
          price: 99.99,
          quantity: 1,
          image: "/assets/images/products/image3.png",
        },
        {
          id: "2",
          name: "Luxury Fragrance",
          price: 100.0,
          quantity: 3,
          image: "/assets/images/products/creed.png",
        },
      ],
    }));
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    dispatch(setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setStep(step + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <TopBanner />
        <ProgressSteps step={step} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step}>
                {step === 1 && (
                  <ShippingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                  />
                )}
                {step === 2 && (
                  <PaymentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    onBackStep={() => dispatch(setStep(step - 1))}
                    orderTotal={orderSummary.total}
                  />
                )}
                {step === 3 && (
                  <ConfirmationPage
                    formData={formData}
                    orderSummary={orderSummary}
                    orderNumber="123456"
                    onBackStep={() => dispatch(setStep(step - 1))}
                    currentStep={step}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              {orderSummary.items.map((item:any, index:any) => (
                <OrderSummaryItem key={index} item={item} index={index} />
              ))}
              <PriceBreakdown orderSummary={orderSummary} />
              <TrustBadges />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
