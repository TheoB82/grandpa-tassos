import "../styles/globals.css";
import { LanguageProvider } from "./context/LanguageContext"; // Correct path
import Header from "./components/Header"; // Corrected path relative to src/app
import CookieBanner from "./components/CookieBanner"; // Import CookieBanner component
import { useEffect, useState } from "react"; // Import useState and useEffect

export const metadata = {
  title: "Grandpa Tassos",
  description: "Authentic Greek recipes passed down through generations.",
};

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  // Ensure that the useLanguage hook is only used on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang={isClient ? 'en' : 'el'}> {/* Set the language based on client-side state */}
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Quicksand:wght@400;700&family=Mynerve&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {isClient && <Header />} {/* Render Header only after client-side rendering */}
          <div className="pt-52">{children}</div>
          <CookieBanner /> {/* Add the CookieBanner here */}
        </LanguageProvider>
      </body>
    </html>
  );
}
