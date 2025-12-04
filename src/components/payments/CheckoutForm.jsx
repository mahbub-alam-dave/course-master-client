"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

export default function CheckoutForm({ courseId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // Confirm payment with Stripe (NO REDIRECT)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // This prevents redirect
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment successful, now confirm with backend
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/payment/confirm-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              courseId: courseId,
            }),
          }
        );

        const data = await res.json();

        if (data.success) {
          setMessage("Payment successful! Redirecting...");
          // Call success callback to close modal and redirect
          setTimeout(() => {
            onSuccess(data.data);
          }, 1500);
        } else {
          setMessage(data.message || "Payment confirmation failed");
        }
      } catch (err) {
        console.error("Error confirming payment:", err);
        setMessage("Error confirming payment. Please contact support.");
      }
      
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("successful")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}