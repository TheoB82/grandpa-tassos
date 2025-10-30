"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useLanguage } from "./context/LanguageContext";
import RecipeGrid from "./components/RecipeGrid";
import Header from "./components/Header";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  // Fetch recipes on component mount with cache-busting query
  useEffect(() => {
    setIsLoading(true);
    fetch(`/recipes.json?timestamp=${new Date().getTime()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRecipes(data);
          setError(null);
        } else {
          throw new Error("Invalid recipe data format");
        }
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter recipes by language
  const filteredRecipes = recipes.map((recipe) => ({
    ...recipe,
    Category: recipe[`Category${language}`],
    Title: recipe[`Title${language}`],
    ShortDescription: recipe[`ShortDescription${language}`],
    Ingredients: recipe[`Ingredients${language}`],
    LongDescription: recipe[`LongDescription${language}`],
    Execution: recipe[`Execution${language}`],
    Tags: recipe[`Tags${language}`]
  }));

  return (
    <>
      {/* Google AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2171074805444072"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <div className="bg-gray-100 min-h-screen">
        {/* Header Component */}
        <Header />

        {/* Main Content with padding for fixed header */}
        <main className="pt-36 pb-10">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            {language === "EN" ? "My Recipes" : "Οι Συνταγές μου"}
          </h1>

          {/* Embedded YouTube Video */}
          <div className="flex justify-center mb-10 px-4">
            <div className="w-full max-w-2xl aspect-video">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/4S8BY3RJbz4?si=ksoODIgLtgqlNuxE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">
                  {language === "EN" ? "Loading recipes..." : "Φόρτωση συνταγών..."}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-2xl mx-auto px-4 py-10">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <svg
                  className="w-12 h-12 text-red-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  {language === "EN" ? "Oops! Something went wrong" : "Ωχ! Κάτι πήγε στραβά"}
                </h2>
                <p className="text-red-600 mb-4">
                  {language === "EN" 
                    ? "We couldn't load the recipes. Please try refreshing the page." 
                    : "Δεν μπορέσαμε να φορτώσουμε τις συνταγές. Παρακαλώ δοκιμάστε να ανανεώσετε τη σελίδα."}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  {language === "EN" ? "Refresh Page" : "Ανανέωση Σελίδας"}
                </button>
              </div>
            </div>
          )}

          {/* Recipe Grid */}
          {!isLoading && !error && (
            <>
              {filteredRecipes.length > 0 ? (
                <RecipeGrid recipes={filteredRecipes} language={language} />
              ) : (
                <div className="text-center py-20 px-4">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-xl text-gray-600">
                    {language === "EN" ? "No recipes available yet" : "Δεν υπάρχουν ακόμα συνταγές"}
                  </p>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {language === "EN" ? "Grandpa Tassos Cooking. All rights reserved." : "Grandpa Tassos Cooking. Με την επιφύλαξη παντός δικαιώματος."}
          </p>
        </footer>
      </div>
    </>
  );
}