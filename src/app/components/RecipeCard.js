import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { FaArrowRight } from "react-icons/fa";

export default function RecipeCard({ recipe }) {
  const { language } = useLanguage();

  // Get the recipe steps based on the selected language
  const steps = language === "EN" ? recipe.ExecutionEN : recipe.ExecutionGR;
  
  // Split the steps by double newline and ensure each step is cleanly separated
  const stepsArray = steps.split("\n\n").map(step => step.trim());

  // Meta tags for SEO (hidden from users but visible to search engines)
  const tags = language === "EN" ? recipe.TagsEN : recipe.TagsGR;

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
      {/* Meta tags for SEO */}
      <meta name="keywords" content={tags.join(', ')} />

      {/* Recipe Category */}
      <p className="bg-gray-200 text-gray-700 text-sm font-semibold py-2 text-center uppercase tracking-wide">
        {language === "EN" ? recipe.CategoryEN : recipe.CategoryGR}
      </p>

      {/* Recipe Image */}
      <div className="relative w-full h-52">
        <Image
          src={recipe.Image}
          alt={language === "EN" ? recipe.TitleEN : recipe.TitleGR}
          layout="fill"
          objectFit="cover"
          className="transition duration-300 hover:opacity-90"
          priority
        />
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">
          {language === "EN" ? recipe.TitleEN : recipe.TitleGR}
        </h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {language === "EN" ? recipe.ShortDescriptionEN : recipe.ShortDescriptionGR}
        </p>

        {/* Display recipe steps */}
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800">
            {language === "EN" ? "Instructions" : "Οδηγίες"}
          </h4>
          <ul className="mt-2 text-sm text-gray-700 space-y-2 pl-5 pr-8"> {/* Expand width for Execution */}
            {stepsArray.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="font-bold">{index + 1}.</span>
                <span className="ml-2">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ingredients Section */}
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800">
            {language === "EN" ? "Ingredients" : "Υλικά"}
          </h4>
          <ul className="mt-2 text-sm text-gray-700 space-y-2 pr-5 pl-8"> {/* Expand width for Ingredients */}
            {language === "EN" ? recipe.IngredientsEN : recipe.IngredientsGR}
          </ul>
        </div>

        {/* View More Button */}
        <Link href={`/recipes/${recipe.TitleEN.replace(/\s+/g, "-").toLowerCase()}`}>
          <a className="mt-4 inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            {language === "EN" ? "View More" : "Δείτε Περισσότερα"}  
            <FaArrowRight className="ml-2" />
          </a>
        </Link>
      </div>
    </div>
  );
}
