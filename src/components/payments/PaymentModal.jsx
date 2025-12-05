"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { X, Loader2 } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentModal({ isOpen, onClose, course, onSuccess }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showLoading, closeAlert, showWarning } = useAlert();

  useEffect(() => {
    if (isOpen && course) {
      createPaymentIntent();
    }
  }, [isOpen, course]);

  const createPaymentIntent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        closeAlert()
        showWarning("Please login to enroll in this course", {
          title: "Please login"
        });
        onClose();
        return;
      }

      const amount = course.discountPrice || course.price;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: course._id || course.id,
            amount: amount,
            currency: "usd",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setClientSecret(data.data.clientSecret);
      } else {
        closeAlert()
        showError(data.message || "Failed to initialize payment", {
          title: "Initialization failed"
        });
        onClose();
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      closeAlert()
      showError("Failed to initialize payment. Please try again.", {
        title: "Initialization failed"
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (paymentData) => {
    onSuccess(paymentData);
    onClose();
  };

  if (!isOpen) return null;

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#2563eb",
    },
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Course Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                {course.title}
              </h3>
              <div className="flex items-center gap-2">
                {course.discountPrice ? (
                  <>
                    <span className="text-2xl font-bold text-gray-800">
                      ${course.discountPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${course.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    ${course.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Initializing secure payment...</p>
            </div>
          ) : clientSecret ? (
            <Elements
              options={{ clientSecret, appearance }}
              stripe={stripePromise}
            >
              <CheckoutForm
                courseId={course._id || course.id}
                onSuccess={handleSuccess}
              />
            </Elements>
          ) : (
            <div className="text-center text-red-600 py-8">
              Failed to initialize payment
            </div>
          )}
        </div>
      </div>
    </div>
  );
}