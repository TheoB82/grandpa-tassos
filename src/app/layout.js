// src/app/layout.js

"use client";

import { LanguageProvider } from "./context/LanguageContext"; // Correct path
import Header from "./components/Header"; // Corrected path relative to src/app
import CookieBanner from "./components/CookieBanner"; // Import CookieBanner component
import { useEffect, useState } from "react"; // Import useState and useEffect

// Import metadata from the newly created metadata file
import { metadata } from "./metadata"; 

export default function Layout({ children }) {
  useEffect(() => {
    // Any client-side effects can go here
  }, []);

  return (
    <LanguageProvider>
      <Header />
      <CookieBanner />
      <main>{children}</main>
    </LanguageProvider>
  );
}
import "../styles/globals.css";
import { LanguageProvider } from "./context/LanguageContext"; // Correct path
import Header from "./components/Header"; // Corrected path relative to src/app
import CookieBanner from "./components/CookieBanner"; // Import CookieBanner component

export const metadata = {
  title: "Grandpa Tassos",
  description: "Authentic Greek recipes passed down through generations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Quicksand:wght@400;700&display=swap"
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
