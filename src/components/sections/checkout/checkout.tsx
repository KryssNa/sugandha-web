"use client";
import { useCheckout } from "@/hooks/useCheckout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setOrderSummary, setStep } from "@/store/slices/checkoutSlice";
import { addToWishlist } from "@/store/slices/wishlistSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { OrderSummaryItem } from "./orderSummary";
import { PaymentForm } from "./paymentForm";
import { PriceBreakdown } from "./priceBreakdown";
import { ProgressSteps } from "./progressStep";
import { ShippingForm } from "./shippingForm";
import { TopBanner } from "./topBanner";
import { TrustBadges } from "./trustBadge";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  // const { step, formData, orderSummary } = useAppSelector((state) => state.checkout);

  const { items: cartItems, couponCode, totals: cartTotals } = useAppSelector(
    (state) => state.cart
  );

  const {
    step,
    formData,
    orderSummary,
    handleInputChange,
    handleRemoveItem,
    handleUpdateQuantity,
    // handleSubmit,
    handlePrevStep,
    createCheckout
  } = useCheckout();

  // order summary
  useEffect(() => {
    dispatch(setOrderSummary(
      {
        items: cartItems,
        total: cartTotals.total,
        subtotal: cartTotals.subtotal,
        shipping: cartTotals.shipping,
        tax: cartTotals.tax,
      }
    ));
  }, [dispatch]);


  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   dispatch(setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  // const handleRemoveItem = (index: number) => {
  //   const updatedItems = orderSummary.items.filter((_, i) => i !== index);
  //   dispatch(setOrderSummary({
  //     ...orderSummary,
  //     items: updatedItems,
  //   }));
  // }

  // const handleUpdateQuantity = (id: string, newQuantity: number) => {
  //   const updatedItems = orderSummary.items.map((item) => {
  //     if (item.id === id) {
  //       return {
  //         ...item,
  //         quantity: newQuantity,
  //       };
  //     }
  //     return item;
  //   });
  //   dispatch(updateCartQuantity({ productId:id, quantity: newQuantity }));
  //   dispatch(setOrderSummary({
  //     ...orderSummary,
  //     items: updatedItems,
  //   }));
  // }

  const handleAddToWishlist = (item: any) => {
    // dispatch(addToWishlist(item));
    dispatch(addToWishlist(item));
    console.log("Added to wishlist", item);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For shipping step (step 1), just move to next step
    if (step === 1) {
      dispatch(setStep(step + 1));
      return;
    }

    // For payment step (step 2), create checkout
    if (step === 2) {
      try {
        // Validate payment details before creating checkout
        if (!formData.paymentMethod) {
          toast.error('Please select a payment method');
          return;
        }

        // Create checkout
        const checkoutResult = await createCheckout();

        // If checkout is successful, move to confirmation step
        if (checkoutResult) {
          dispatch(setStep(step + 1));
        }
      } catch (error) {
        // Error handling is done inside createCheckout
        console.error('Checkout failed', error);
      }
      return;
    }

    // For confirmation step (step 3), you might want to handle differently
    // For example, maybe allow printing or sharing order details
  };



  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   dispatch(setStep(step + 1));
  // };

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
                  <>

                    checkout confirm
                  </>
                  // <ConfirmationPage
                  //   formData={formData}
                  //   orderSummary={orderSummary}
                  //   orderNumber="123456"
                  //   onBackStep={() => dispatch(setStep(step - 1))}
                  //   currentStep={step}
                  // />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              {orderSummary.items.map((item: any, index: any) => (
                <OrderSummaryItem key={index} item={item} index={index}

                  onRemove={
                    () => handleRemoveItem(index)
                  }
                  onSaveForLater={
                    () => handleAddToWishlist(item)
                  }
                  onUpdateQuantity={
                    (id: string, newQuantity: number) => handleUpdateQuantity(id, newQuantity)
                  }
                />
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
