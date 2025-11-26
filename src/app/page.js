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

  // Fetch recipes with cache-busting
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
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2171074805444072"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <div className="bg-gray-100 min-h-screen">
        {/* Fixed header */}
        <Header />

        {/* MAIN CONTENT */}
        {/* Reduced top spacing to match logo header height */}
        <main className="pt-[120px] pb-10">

          {/* CENTERED PAGE WRAPPER */}
          <div className="max-w-4xl mx-auto w-full px-4">

            {/* Title */}
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
              {language === "EN" ? "My Recipes" : "Οι Συνταγές μου"}
            </h1>

            {/* Centered YouTube video */}
            <div className="w-full flex justify-center mb-10">
              <div className="aspect-video w-full max-w-3xl mx-auto">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/wMZqIWjjAFY?si=KyU8_Hnmm85N5ivn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
            </div>

          </div>

          {/* LOADING STATE */}
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

          {/* ERROR */}
          {!isLoading && error && (
            <div className="max-w-2xl mx-auto px-4 py-10">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  {language === "EN" ? "Oops! Something went wrong" : "Ωχ! Κάτι πήγε στραβά"}
                </h2>
                <p className="text-red-600 mb-4">
                  {language === "EN"
                    ? "We couldn't load the recipes. Please refresh the page."
                    : "Δεν μπορέσαμε να φορτώσουμε τις συνταγές. Παρακαλώ ανανεώστε τη σελίδα."}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  {language === "EN" ? "Refresh Page" : "Ανανέωση Σελίδας"}
                </button>
              </div>
            </div>
          )}

          {/* RECIPES GRID */}
          {!isLoading && !error && (
            <>
              {filteredRecipes.length > 0 ? (
                <RecipeGrid recipes={filteredRecipes} language={language} />
              ) : (
                <div className="text-center py-20 px-4">
                  <p className="text-xl text-gray-600">
                    {language === "EN" ? "No recipes available yet" : "Δεν υπάρχουν ακόμα συνταγές"}
                  </p>
                </div>
              )}
            </>
          )}
        </main>

        {/* FOOTER */}
        <footer className="bg-gray-800 text-white py-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()}{" "}
            {language === "EN"
              ? "Grandpa Tassos Cooking. All rights reserved."
              : "Grandpa Tassos Cooking. Με την επιφύλαξη παντός δικαιώματος."}
          </p>
        </footer>
      </div>
    </>
  );
}
