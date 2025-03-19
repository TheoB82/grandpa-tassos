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
    return <div>Recipe not found 😞</div>;
  }

  // Destructure execution steps
  const executionStepsGR = recipe.ExecutionGR || [];
  const executionStepsEN = recipe.ExecutionEN || [];

  return (
    <div>
      <h1>{recipe.TitleEN}</h1>
      <p>{recipe.ShortDescriptionEN}</p>

      <h2>Execution (Greek)</h2>
      <ul>
        {executionStepsGR.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>

      <h2>Execution (English)</h2>
      <ul>
        {executionStepsEN.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipePage;
