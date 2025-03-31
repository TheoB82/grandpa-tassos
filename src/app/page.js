"use client"; // Ensure this file runs on the client side

import React, { useState, useEffect } from "react";
import { useLanguage } from "./context/LanguageContext"; // Adjust the path to the context
import RecipeGrid from "./components/RecipeGrid"; // Correct path to RecipeGrid
import Header from "./components/Header"; // Go up two levels and then into the components folder

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const { language } = useLanguage();

  // Fetch recipes on component mount with cache-busting query
  useEffect(() => {
    fetch(`/recipes.json`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error loading recipes:", error));
  }, []);
  

  // Filter recipes based on selected category
  const filteredRecipes = selectedCategory
    ? recipes.filter(
        (recipe) => recipe[`Category${language}`] === selectedCategory
      )
    : recipes; // Show all recipes if no category is selected

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Component */}
      <Header setCategory={setSelectedCategory} /> {/* Pass the setter function to Header */}

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mt-2 mb-6">
        {language === "EN" ? "My Recipes" : "Οι Συνταγές μου"}
      </h1>

      {/* Embedded YouTube Video */}
      <div className="flex justify-center mb-10 min-h-[315px]">
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/f_ZUEhudAWI?si=_-4Zyo3ZNiyjGJzt" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
        </iframe>
      </div>

      {/* Recipe Grid */}
      <RecipeGrid recipes={filteredRecipes} language={language} />
    </div>
  );
}
