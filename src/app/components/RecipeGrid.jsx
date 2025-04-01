"use client";

import React, { useState } from "react";
import Link from "next/link";
import { categoryMapping } from "../../utils/categoryMapping";

const RecipeGrid = ({ recipes, language, isCategoryPage }) => {
  const [visibleRecipes, setVisibleRecipes] = useState(12);

  // Parse dates properly across all devices (DD/MM/YYYY → YYYY-MM-DD)
  const parseDate = (dateStr) => {
    if (typeof dateStr !== "string") return new Date(0); // Default to oldest date if invalid
    const parts = dateStr.split("/");
    if (parts.length !== 3) return new Date(0);
  
    const [day, month, year] = parts.map((part) => parseInt(part, 10));
    if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date(0); // Handle invalid numbers
  
    // Return a valid Date object
    return new Date(year, month - 1, day); // Use year, month (0-based), day
  };

  // Sort recipes by Date (newest first)
  const sortedRecipes = [...recipes].sort((a, b) => parseDate(b.Date) - parseDate(a.Date));

  // Function to get the image link from YouTube link
  const getImageLink = (recipe) => {
    const ytLink = recipe.LinkYT;
    const videoIdMatch = ytLink?.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "/path/to/default-image.jpg"; // Fallback image
  };

  // Function to get the category path using categoryMapping
  const getCategoryPath = (categoryName) => {
    const category = categoryMapping[language].find(
      (cat) => cat.name === categoryName || cat.en === categoryName
    );
    return category ? category.path : "/";
  };

  const loadMore = () => {
    setVisibleRecipes((prev) => prev + 12);
  };

  return (
    <div>
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {sortedRecipes.slice(0, visibleRecipes).map((recipe, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl p-4 shadow-md hover:shadow-xl transform transition duration-300 hover:scale-105"
          >
            {/* Category - Only render if not on the category page */}
{!isCategoryPage && (
  <div className="text-sm font-semibold mb-2 text-center tracking-wide">
    <Link
      href={getCategoryPath(
        language === "GR" ? recipe.CategoryGR : recipe.CategoryEN
      )}
      className="text-blue-600 hover:underline"
    >
      {(language === "GR" ? recipe.CategoryGR : recipe.CategoryEN)
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())}
    </Link>
  </div>
)}


            {/* Image */}
            <div className="h-48 bg-gray-200 rounded-md overflow-hidden">
              <img
                src={getImageLink(recipe)}
                alt={language === "GR" ? recipe.TitleGR : recipe.TitleEN}
                className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
              />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mt-3 text-center">
              <Link href={`/recipes/${recipe.TitleEN.toLowerCase().replace(/ /g, "-")}`}>
                {language === "GR" ? recipe.TitleGR : recipe.TitleEN}
              </Link>
            </h3>

            {/* Short Description */}
            <p className="text-gray-600 text-sm mt-2 text-center leading-relaxed">
              {language === "GR" ? recipe.ShortDescriptionGR : recipe.ShortDescriptionEN}
            </p>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {visibleRecipes < sortedRecipes.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            {language === "EN" ? "Show More" : "Δείτε Περισσότερα"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;
