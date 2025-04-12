"use client"; // Ensure this file runs on the client side

import React, { useState, useEffect } from "react";
import { useLanguage } from "./context/LanguageContext"; // Adjust the path to the context
import RecipeGrid from "./components/RecipeGrid"; // Correct path to RecipeGrid
import Header from "./components/Header"; // Go up two levels and then into the components folder

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const { language } = useLanguage();

  // Fetch recipes on component mount with cache-busting query
  useEffect(() => {
    fetch(`/recipes.json?timestamp=${new Date().getTime()}`) // Path from public folder with cache busting
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error loading recipes:", error));
  }, []); 

  // Only filter recipes by language
  const filteredRecipes = recipes.map((recipe) => ({
    ...recipe,
    Category: recipe[`Category${language}`], // Ensure category is still accessible
    Title: recipe[`Title${language}`],
    ShortDescription: recipe[`ShortDescription${language}`],
    Ingredients: recipe[`Ingredients${language}`],
    LongDescription: recipe[`LongDescription${language}`],
    Execution: recipe[`Execution${language}`],
    Tags: recipe[`Tags${language}`]
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Component */}
      <Header /> 

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mt-2 mb-6">
        {language === "EN" ? "My Recipes" : "Οι Συνταγές μου"}
      </h1>

      {/* Embedded YouTube Video */}
      <div className="flex justify-center mb-10 min-h-[315px]">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/RqEV_ZXgePA?si=rgpGBjG8A2TYyu6L" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      {/* Recipe Grid */}
      <RecipeGrid recipes={filteredRecipes} language={language} />
    </div>
  );
}
