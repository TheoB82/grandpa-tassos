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
