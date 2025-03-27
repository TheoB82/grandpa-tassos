import { useState } from "react";

export default function CookieBanner() {
  const [isAccepted, setIsAccepted] = useState(
    typeof window !== "undefined" && localStorage.getItem("cookiesAccepted")
  );

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsAccepted(true);
  };

  if (isAccepted) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 text-center flex flex-col sm:flex-row items-center justify-center gap-4 shadow-lg">
      <p className="text-sm">
        This website uses cookies to ensure you get the best experience. We do not store or share personal data.
      </p>
      <button
        onClick={acceptCookies}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Accept
      </button>
    </div>
  );
}
