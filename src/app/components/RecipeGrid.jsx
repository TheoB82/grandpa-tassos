"use client";

import React, { useState } from "react";
import Link from "next/link";
import { categoryMapping } from "../../utils/categoryMapping"; // Correct path based on your folder structure

const RecipeGrid = ({ recipes, language, isCategoryPage }) => {
  const [visibleRecipes, setVisibleRecipes] = useState(12);

  // Sort recipes by Date (most recent first)
  const sortedRecipes = [...recipes].sort((a, b) => {
    const dateA = typeof a.Date === "string" ? a.Date.split("/").reverse().join("-") : "";
    const dateB = typeof b.Date === "string" ? b.Date.split("/").reverse().join("-") : "";
    return new Date(dateB) - new Date(dateA);
  });

  // Function to get the image link from YouTube link
  const getImageLink = (recipe) => {
    const ytLink = recipe.LinkYT;
    const videoIdMatch = ytLink?.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (videoId) {
      // Try to load the max resolution image first
      const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      // If max resolution image fails, fallback to 'hqdefault.jpg'
      const fallbackImageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return { imageUrl, fallbackImageUrl };
    }
    
    // Return a default image if no video ID is found
    return { imageUrl: "/path/to/default-image.jpg", fallbackImageUrl: "/path/to/default-image.jpg" };
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
        {sortedRecipes.slice(0, visibleRecipes).map((recipe, index) => {
          const { imageUrl, fallbackImageUrl } = getImageLink(recipe);

          return (
            <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
              {/* Category - Only render if not on the category page */}
              {!isCategoryPage && (
                <div className="text-lg font-semibold mb-2 text-center">
                  <Link
                    href={getCategoryPath(
                      language === "GR" ? recipe.CategoryGR : recipe.CategoryEN
                    )}
                    className="text-blue-500 hover:underline"
                  >
                    {language === "GR" ? recipe.CategoryGR : recipe.CategoryEN}
                  </Link>
                </div>
              )}

              {/* Image */}
              <div className="h-48 bg-gray-300 mb-4">
                <img
                  src={imageUrl}
                  alt={language === "GR" ? recipe.TitleGR : recipe.TitleEN}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = fallbackImageUrl}  // Fallback to the alternative image if error occurs
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2 text-center">
                <Link href={`/recipes/${recipe.TitleEN.toLowerCase().replace(/ /g, "-")}`}>
                  {language === "GR" ? recipe.TitleGR : recipe.TitleEN}
                </Link>
              </h3>

              {/* Short Description */}
              <p className="text-gray-600 text-sm mb-4 text-center">
                {language === "GR" ? recipe.ShortDescriptionGR : recipe.ShortDescriptionEN}
              </p>
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {visibleRecipes < sortedRecipes.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            {language === "GR" ? "Περισσότερα" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;
