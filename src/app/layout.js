import "../styles/globals.css";
import { LanguageProvider, useLanguage } from "./context/LanguageContext"; // Correct path
import Header from "./components/Header"; // Corrected path relative to src/app
import CookieBanner from "./components/CookieBanner"; // Import CookieBanner component

export const metadata = {
  title: "Grandpa Tassos",
  description: "Authentic Greek recipes passed down through generations.",
};

export default function RootLayout({ children }) {
  // Use the context to get the current language (EN or GR)
  const { language } = useLanguage();

  return (
    <html lang={language}> {/* Dynamically set the language */}
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Quicksand:wght@400;700&family=Mynerve&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <Header />
          <div className="pt-52">{children}</div>
          <CookieBanner /> {/* Add the CookieBanner here */}
        </LanguageProvider>
      </body>
    </html>
  );
}
