"use client"; // Ensure this file runs on the client side

import React, { useState, useEffect } from "react";
import { useLanguage } from "./context/LanguageContext"; // Adjust the path to the context
import RecipeGrid from "./components/RecipeGrid"; // Correct path to RecipeGrid
import Header from "./components/Header"; // Go up two levels and then into the components folder

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const { language } = useLanguage();

  // Fetch recipes on component mount
  useEffect(() => {
    fetch("/recipes.json") // Path from public folder
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
    <div>
      <Header setCategory={setSelectedCategory} /> {/* Pass the setter function to Header */}

      <h1 className="text-4xl font-bold text-center mt-24 mb-6">
        {language === "EN" ? "My Recipes" : "Οι Συνταγές μου"}
      </h1>

      {/* Embedded YouTube Video */}
      <div className="flex justify-center mb-10 px-4">
        <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src="https://youtu.be/domQLeVFwfQ?feature=shared"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <RecipeGrid recipes={filteredRecipes} language={language} />
    </div>
  );
}
