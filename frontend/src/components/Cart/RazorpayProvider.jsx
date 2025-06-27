import React, { useEffect, useState, createContext, useContext } from "react";

// Create a context for Razorpay
const RazorpayContext = createContext();

export const useRazorpay = () => useContext(RazorpayContext);

export const RazorpayProvider = ({ children, options }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <RazorpayContext.Provider value={{ options }}>
      {children}
    </RazorpayContext.Provider>
  );
};
