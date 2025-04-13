"use client"; // Ensure this file runs on the client side
import "../styles/globals.css";
import { LanguageProvider, useLanguage } from "./context/LanguageContext"; // Correct path
import Header from "./components/Header"; // Corrected path relative to src/app

export default function RootLayout({ children }) {
  const { language } = useLanguage(); // Access the language context

  return (
    <html lang={language === "GR" ? "el" : "en"}>
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
        </LanguageProvider>
      </body>
    </html>
  );
}