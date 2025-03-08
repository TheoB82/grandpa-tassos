"use client"; // Ensure this file runs on the client side

import React, { useState, useEffect } from "react";
import { useLanguage } from "./context/LanguageContext"; // Adjust the path to the context
import RecipeGrid from "./components/RecipeGrid"; // Correct path to RecipeGrid
import Header from "./components/Header"; // Go up two levels and then into the components folder
import { categoryMapping } from "../utils/categoryMapping";

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
        (recipe) =>
          recipe[`Category${language}`] && recipe[`Category${language}`] === selectedCategory
      )
    : recipes;  // Show all recipes if no category is selected

  // Debugging: log selected category and filtered recipes
  console.log("Selected Category: ", selectedCategory);
  console.log("Filtered Recipes: ", filteredRecipes);

  return (
    <div>
      <Header setCategory={setSelectedCategory} /> {/* Pass the setter function to Header */}
      <h1 className="text-4xl font-bold text-center mt-18">
        {language === "EN" ? "My Recipes" : "Οι Συνταγές μου"}
      </h1>

      <RecipeGrid recipes={filteredRecipes} language={language} />
    </div>
  );
}