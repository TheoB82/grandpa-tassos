import Link from "next/link";

export default function RecipeCard({ recipe, language }) {
  // Ensure recipe.Image exists or use a default image
  const imagePath = recipe.Image && recipe.Image !== "TBC" 
    ? `/images/${recipe.Image}` 
    : "/images/default-image.jpg";

  // Generate a URL-friendly slug from TitleEN
  const slug = recipe.TitleEN?.toLowerCase().trim()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  return (
    <Link href={`/recipes/${slug}`} className="block">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <img 
          src={imagePath} 
          alt={language === "GR" ? recipe.TitleGR : recipe.TitleEN} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-4">
          {/* Display category */}
          <div className="text-sm text-gray-500">
            {language === "GR" ? recipe.CategoryGR : recipe.CategoryEN}
          </div>
          <h3 className="text-xl font-bold mt-2">
            {language === "GR" ? recipe.TitleGR : recipe.TitleEN}
          </h3>
          <p className="text-gray-600 mt-2">
            {language === "GR" ? recipe.ShortDescriptionGR : recipe.ShortDescriptionEN}
          </p>
        </div>
      </div>
    </Link>
  );
}
