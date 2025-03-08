"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import RecipeGrid from "../components/RecipeGrid";
import { useLanguage } from "../context/LanguageContext";

const FestivePage = () => {
  const { language } = useLanguage();
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

   // Redirect based on language selection
   useEffect(() => {
     if (language === "GR" && pathname === "/festive") {
       router.push("/eortastika"); // Redirect to Greek version
     } else if (language === "EN" && pathname === "/eortastika") {
       router.push("/festive"); // Redirect to English version
     }
   }, [language, pathname, router]);

  // Fetch recipes
  useEffect(() => {
    fetch("/recipes.json")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error loading recipes:", error));
  }, []);

  // Filter recipes by category
  const selectedCategory = language === "EN" ? "Festive" : "Εορταστικά";
  const filteredRecipes = recipes.filter(
    (recipe) => recipe[`Category${language}`] === selectedCategory
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        {language === "EN" ? "Festive" : "Εορταστικά"}
      </h1>
      {/* Render the RecipeGrid with isCategoryPage set to true */}
      <RecipeGrid recipes={filteredRecipes} language={language} isCategoryPage={true} />
    </div>
  );
};

export default FestivePage;
