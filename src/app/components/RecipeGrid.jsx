"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { categoryMapping } from "../../utils/categoryMapping";

const RecipeGrid = ({ recipes, language, isCategoryPage }) => {
  const [visibleRecipes, setVisibleRecipes] = useState(12);
  const [imageError, setImageError] = useState({});

  // Sort recipes by Date (most recent first)
  const sortedRecipes = [...recipes].sort((a, b) => {
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0); // Default to old date if missing
      const parts = dateStr.split("/"); // Split into [DD, MM, YYYY]
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Convert to YYYY-MM-DD
    };
  
    return parseDate(b.Date) - parseDate(a.Date);
  });
  

  // Function to get the video ID from YouTube link
  const getVideoId = (ytLink) => {
    const match = ytLink?.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  // Function to get the YouTube thumbnail link
  const getImageLink = (recipe) => {
    const videoId = getVideoId(recipe.LinkYT);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "/path/to/default-image.jpg";
  };

  // Function to handle image errors
  const handleImageError = (index, videoId) => {
    setImageError((prevState) => {
      if (prevState[index] === "maxres" && videoId) {
        return { ...prevState, [index]: "fallback" };
      } else if (videoId) {
        return { ...prevState, [index]: "maxres" };
      }
      return { ...prevState, [index]: "fallback" };
    });
  };

  // Function to get the category path
  const getCategoryPath = (categoryName) => {
    const category = categoryMapping[language].find(
      (cat) => cat.name === categoryName || cat.en === categoryName
    );
    return category ? category.path : "/";
  };

  const loadMore = () => {
    setVisibleRecipes((prev) => prev + 12);
  };

  useEffect(() => {
    setImageError({});
  }, [visibleRecipes]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {sortedRecipes.slice(0, visibleRecipes).map((recipe, index) => {
          const videoId = getVideoId(recipe.LinkYT);
          const imageUrl = getImageLink(recipe);
          const fallbackImageUrl = "/path/to/default-image.jpg";

          return (
            <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
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

              <div className="h-48 bg-gray-300 mb-4">
                <img
                  src={
                    imageError[index] === "fallback"
                      ? fallbackImageUrl
                      : imageError[index] === "maxres"
                      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                      : imageUrl
                  }
                  alt={language === "GR" ? recipe.TitleGR : recipe.TitleEN}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index, videoId)}
                />
              </div>

              <h3 className="text-xl font-bold mb-2 text-center">
                <Link href={`/recipes/${encodeURIComponent(recipe.TitleEN.toLowerCase().replace(/\s+/g, "-"))}`}>
                  {language === "GR" ? recipe.TitleGR : recipe.TitleEN}
                </Link>
              </h3>

              <p className="text-gray-600 text-sm mb-4 text-center">
                {language === "GR" ? recipe.ShortDescriptionGR : recipe.ShortDescriptionEN}
              </p>
            </div>
          );
        })}
      </div>

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
