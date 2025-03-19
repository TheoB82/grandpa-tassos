// src/app/recipes/[slug].js
import { useRouter } from 'next/router';
import recipes from '../../recipes.json';

const RecipePage = () => {
  const { query } = useRouter();
  const { slug } = query;

  // Find recipe based on slug
  const recipe = recipes.find(
    (r) => normalizeSlug(r.TitleEN) === slug.toLowerCase()
  );

  if (!recipe) {
    return <div>Recipe not found skdjs😞</div>;
  }

  return (
    <div>
      <h1>{recipe.TitleEN}</h1>
      <p>{recipe.ShortDescriptionEN}</p>
      {/* Render recipe details */}
    </div>
  );
};

export default RecipePage;
