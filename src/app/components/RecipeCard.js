import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";

export default function RecipeCard({ recipe }) {
  const { language } = useLanguage();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Recipe Category */}
      <p className="bg-gray-200 text-gray-700 text-sm font-semibold p-2 text-center">
        {language === "EN" ? recipe.CategoryEN : recipe.CategoryGR}
      </p>

      {/* Recipe Image */}
      <div className="relative w-full h-48">
        <Image
          src={recipe.Image}
          alt={language === "EN" ? recipe.TitleEN : recipe.TitleGR}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">
          {language === "EN" ? recipe.TitleEN : recipe.TitleGR}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {language === "EN" ? recipe.ShortDescriptionEN : recipe.ShortDescriptionGR}
        </p>

        {/* View More Button */}
        <Link href={`/recipes/${recipe.TitleEN.replace(/\s+/g, "-").toLowerCase()}`}>
          <a className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            {language === "EN" ? "View More" : "Δείτε Περισσότερα"}
          </a>
        </Link>
      </div>
    </div>
  );
}