"use client";
import { showToast } from "@/components/shared/toast/showAlet";
import { useCheckout } from "@/hooks/useCheckout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItemToCart } from "@/store/slices/cartSlice";
import { setOrderSummary, setStep } from "@/store/slices/checkoutSlice";
import { addToWishlist } from "@/store/slices/wishlistSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrderSummaryItem } from "./orderSummary";
import { PaymentForm } from "./paymentForm";
import { PriceBreakdown } from "./priceBreakdown";
import { ProgressSteps } from "./progressStep";
import { ShippingForm } from "./shippingForm";
import { TopBanner } from "./topBanner";
import { TrustBadges } from "./trustBadge";

interface CheckoutPageProps {
  product?: any;
}

const CheckoutPage = ({ product }: CheckoutPageProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const { step, formData, orderSummary } = useAppSelector((state) => state.checkout);

  const { items: cartItems, couponCode, totals: cartTotals } = useAppSelector(
    (state) => state.cart
  );

  // if no items in cart, assign product to cart
  useEffect(() => {
    if (cartItems.length === 0 && product) {
      dispatch(addItemToCart({
        product: product,
        productId: product.id as string,
        quantity: 1
      }));
    }
  }, [dispatch, cartItems, product]);

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
        console.log("step 2");
        // Validate payment details before creating checkout
        if (!formData.paymentMethod) {
          showToast('error', 'Please select a payment method');
          console.log("Please select a payment method");
          return;
        }

        // Create checkout
        const checkoutResult = await createCheckout();


        // If checkout is successful, move to confirmation step
        if (checkoutResult) {
          showToast('success', 'Successfully placed order');
          console.log("Successfully placed order", checkoutResult);
          router.push(`/checkout/confirmation/${checkoutResult.data.orderId}`);
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
                  <div className="text-center">
                    <div className="flex justify-center items-center">
                      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                      <p className="ml-4">Confirming your order...</p>
                    </div>
                    
                  </div>
                  </>
                 
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          {
            step == 3 ? <></> :

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
          }
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
