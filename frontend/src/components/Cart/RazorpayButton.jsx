import React from "react";
import { RazorpayProvider } from "./RazorpayProvider";

const RazorpayButtonWrapper = ({ amount, onSuccess, onError }) => {

  const handlePayment = () => {
    try {
      // Convert amount to paise and ensure precision
      const convertedAmount = Math.round(parseFloat(amount) * 100); 

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,  // Razorpay API Key
        amount: convertedAmount,                    // Amount in paise
        currency: "INR",
        name: "Your Company",
        description: "Payment for your service",
        image: "/logo.png",
        handler: (response) => {
          console.log(" Payment successful:", response);
          onSuccess(response);
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4F46E5",  // Matching theme color
        },
      };

      const rzp = new window.Razorpay(options);

      //  Enhanced error handling
      rzp.on("payment.failed", (response) => {
        console.error(" Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        onError(response);
      });

      rzp.open();
      
    } catch (error) {
      console.error(" Error initializing Razorpay:", error);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  return (
    <RazorpayProvider>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md text-center">

          <button
            onClick={handlePayment}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full"
          >
            Pay with Razorpay
          </button>
        </div>
      </div>
    </RazorpayProvider>
  );
};

export default RazorpayButtonWrapper;
