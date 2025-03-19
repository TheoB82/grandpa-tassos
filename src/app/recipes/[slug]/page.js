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
        } catch {
          setRecipe(null); // Set recipe to null on error
        }
        setLoading(false);
      };

      fetchRecipe();
    }
  }, [slug]);

  // Function to format Execution steps as a numbered list
  const formatExecutionSteps = (executionText) => {
    const steps = executionText
      .split("\n") // Split based on line breaks
      .filter((step) => step.trim() !== "") // Filter out empty steps
      .map((step, index) => `${index + 1}. ${step.trim()}`); // Add numbering
    return steps.map((step, index) => <li key={index}>{step}</li>);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const executionText =
    language === "EN" ? recipe.ExecutionEN : recipe.ExecutionGR;

  return (
    <div>
      <Header />
      <div>
        <h1>{language === "EN" ? recipe.TitleEN : recipe.TitleGR}</h1>
        <img src={recipe.Image} alt={recipe.TitleEN} />
        <p>{language === "EN" ? recipe.ShortDescriptionEN : recipe.ShortDescriptionGR}</p>
        
        {/* Ingredients */}
        <h3>{language === "EN" ? "Ingredients" : "Συστατικά"}</h3>
        <div
          dangerouslySetInnerHTML={{
            __html: language === "EN" ? recipe.IngredientsEN : recipe.IngredientsGR,
          }}
        />

        {/* Execution Steps */}
        <h3>{language === "EN" ? "Execution" : "Εκτέλεση"}</h3>
        <ol>{formatExecutionSteps(executionText)}</ol>

        {/* Optional: YouTube Video */}
        {recipe.LinkYT && (
          <div>
            <h3>{language === "EN" ? "Watch the Recipe Video" : "Δείτε το βίντεο συνταγής"}</h3>
            <iframe
              width="560"
              height="315"
              src={getYouTubeEmbedUrl(recipe.LinkYT)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
