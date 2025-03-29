import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { FaArrowRight } from "react-icons/fa";

export default function RecipeCard({ recipe }) {
  const { language } = useLanguage();

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
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
