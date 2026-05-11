"use client";
import { useEffect, useState } from "react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex flex-col md:flex-row items-center justify-between shadow-lg z-50">
      <p className="text-sm mb-2 md:mb-0">
        Vi använder cookies för att förbättra din upplevelse. Genom att använda vår sida godkänner du
        till vår cookiepolicy.
      </p>
      <button
        onClick={handleAccept}
        className="bg-orange-600 hover:bg-[#FF914D] text-white px-8 py-2 rounded-md transition"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
