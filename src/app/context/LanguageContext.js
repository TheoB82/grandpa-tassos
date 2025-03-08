"use client"; // Ensure this file is treated as a client-side component

import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for the language
const LanguageContext = createContext();

// Custom hook to access the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("EN"); // Default language

  // On initial load, retrieve language preference from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage); // Set language from localStorage if available
    }
  }, []);

  // Handle language change, update state and localStorage
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage); // Save the selected language to localStorage
  };

  return (
    <LanguageContext.Provider value={{ language, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};
