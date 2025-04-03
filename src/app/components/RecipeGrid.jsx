"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { categoryMapping } from "../../utils/categoryMapping";

const RecipeGrid = ({ recipes, language, isCategoryPage }) => {
  const [visibleRecipes, setVisibleRecipes] = useState(12);
  const [thumbnails, setThumbnails] = useState({});

  // Parse dates properly across all devices (DD/MM/YYYY → YYYY-MM-DD)
  const parseDate = (dateStr) => {
    if (typeof dateStr !== "string") return new Date(0); // Default to oldest date if invalid
    const parts = dateStr.split("/");
    if (parts.length !== 3) return new Date(0);

    const [day, month, year] = parts.map((part) => parseInt(part, 10));
    if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date(0); // Handle invalid numbers

    return new Date(year, month - 1, day); // Use year, month (0-based), day
  };

  // Sort recipes by Date (newest first)
  const sortedRecipes = [...recipes].sort((a, b) => parseDate(b.Date) - parseDate(a.Date));

  // Function to check if an image URL is valid
  const testImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
    });

  // Function to get the best available image link from YouTube
  const getImageLink = async (recipe) => {
    const ytLink = recipe.LinkYT;
    const videoIdMatch = ytLink?.match(
      /(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) return "/path/to/default-image.jpg";

    const maxRes = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const sdRes = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
    const hqRes = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const fallback = `https://i9.ytimg.com/vi/${videoId}/sddefault.jpg`;

    return (await testImage(maxRes)) || (await testImage(sdRes)) || (await testImage(hqRes)) || fallback;
  };

  // Load thumbnails for visible recipes
  useEffect(() => {
    const loadThumbnails = async () => {
      const newThumbnails = {};
      for (const recipe of sortedRecipes.slice(0, visibleRecipes)) {
        if (!thumbnails[recipe.LinkYT]) {
          newThumbnails[recipe.LinkYT] = await getImageLink(recipe);
        }
      }
      setThumbnails((prev) => ({ ...prev, ...newThumbnails }));
    };

    loadThumbnails();
  }, [visibleRecipes, sortedRecipes]);

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
                    .charAt(0)
                    .toUpperCase() + (language === "GR" ? recipe.CategoryGR : recipe.CategoryEN).slice(1).toLowerCase()}
                </Link>
              </div>
            )}

            {/* Image */}
            <div className="h-48 bg-gray-200 rounded-md overflow-hidden">
              <img
                src={thumbnails[recipe.LinkYT] || "/path/to/default-image.jpg"}
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
