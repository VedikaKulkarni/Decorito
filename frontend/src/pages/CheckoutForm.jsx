import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function CheckoutForm({ onSuccess, isProcessing, setIsProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // Confirm the payment without triggering a full page redirect if possible
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // hand back to Checkout.jsx to formally place order in DB
      onSuccess();
    } else {
      setErrorMessage("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-gray-50 border-gray-200">
      <PaymentElement />
      {errorMessage && <div className="mt-3 text-red-500 font-medium text-sm">{errorMessage}</div>}
      <button 
        disabled={isProcessing || !stripe || !elements} 
        className="mt-6 w-full bg-[#411900] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#2e1200] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? "Processing..." : "Pay with Stripe"}
      </button>
    </form>
  );
}
