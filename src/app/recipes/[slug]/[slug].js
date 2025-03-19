// src/app/recipes/[slug].js
import { useRouter } from 'next/router';
import recipes from '../../recipes.json';

const RecipePage = () => {
  const { query } = useRouter();
  const { slug } = query;

  // Find the recipe based on the slug
  const recipe = recipes.find(
    (r) => normalizeSlug(r.TitleEN) === slug.toLowerCase()
  );

  if (!recipe) {
    return <div>Recipe not found 😞</div>;
  }

  // Use this for rendering steps in execution
  const executionSteps = recipe.ExecutionEN || [];

  return (
    <div>
      <h1>{recipe.TitleEN}</h1>
      <p>{recipe.ShortDescriptionEN}</p>
      <h2>Execution Steps</h2>
      <ul>
        {executionSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipePage;
