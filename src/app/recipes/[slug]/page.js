"use client";  // Ensure this file runs on the client side

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import Header from "../../components/Header";

const RecipePage = () => {
  const { slug } = useParams(); // Get the slug from the URL
  const { language } = useLanguage(); // Get the current language
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to extract YouTube video ID and return embed URL
  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url?.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  // Function to normalize the slug for comparison
  const normalizeSlug = (title) => {
    return title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  };

  // Fetch recipe data
  useEffect(() => {
    if (slug) {
      const fetchRecipe = async () => {
        try {
          const response = await fetch("/recipes.json"); // Adjust path as necessary
          const data = await response.json();

          // Match the normalized slug with the title in the recipe data
          const matchedRecipe = data.find((r) =>
            normalizeSlug(r.TitleEN) === slug.toLowerCase()
          );

          if (matchedRecipe) {
            setRecipe(matchedRecipe);
          } else {
            setRecipe(null); // Set recipe to null if not found
          }
        } catch (error) {
          setRecipe(null); // Set recipe to null on error
        }
        setLoading(false);
      };

      fetchRecipe();
    }
  }, [slug]);

  if (!isMounted) return null;
  if (loading) return <div>Loading...</div>;
  if (!recipe) return <div className="text-center text-xl mt-10">Recipe not found 😞</div>;

  return (
    <div>
      <Header />
      
      <div className="max-w-4xl mx-auto p-8 mt-4">
        {/* Recipe Title */}
        <h1 className="text-3xl font-bold text-center mb-4">
          {language === 'EN' ? recipe.TitleEN : recipe.TitleGR}
        </h1>

        {/* YouTube Video (If Exists) */}
        {recipe.LinkYT && getYouTubeEmbedUrl(recipe.LinkYT) && (
          <div className="mt-6">
            <iframe
              width="100%"
              height="400"
              src={getYouTubeEmbedUrl(recipe.LinkYT)}
              title={recipe.TitleEN}
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        )}

        {/* Short Description */}
        <p className="mt-6 text-xl text-center text-gray-800">
          {language === 'EN' ? recipe.ShortDescriptionEN : recipe.ShortDescriptionGR}
        </p>

        {/* Long Description */}
        {language === 'EL' || language === 'GR' ? (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
            {language === 'GR' && (
              <div dangerouslySetInnerHTML={{ __html: recipe.LongDescriptionGR }}></div>
            )}
            {language === 'EN' && (
              <div dangerouslySetInnerHTML={{ __html: recipe.LongDescriptionEN }}></div>
            )}
          </div>
        ) : null}

        {/* Execution Section */}
        <div className="mt-6 flex flex-wrap justify-center">
          <div className="flex-1 mr-12 w-full md:w-1/2">
            <h2 className="text-2xl font-bold mt-6 text-gray-800">
              {language === 'EN' ? "Execution" : "Εκτέλεση"}
            </h2>
            <div className="text-lg" dangerouslySetInnerHTML={{ __html: language === 'EN' ? recipe.ExecutionEN : recipe.ExecutionGR }}></div>
          </div>

          {/* Ingredients Section */}
          <div className="p-6 bg-white border border-gray-300 shadow-lg rounded-lg max-w-xs w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              {language === 'EN' ? "Ingredients" : "Συστατικά"}
            </h2>
            <div className="text-lg text-center" dangerouslySetInnerHTML={{ __html: language === 'EN' ? recipe.IngredientsEN : recipe.IngredientsGR }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;