import { useRouter } from 'next/router';
import recipes from '../../recipes.json';

const RecipePage = () => {
  const { query } = useRouter();
  const { slug } = query;

  // Normalize the slug to compare with recipe title
  const normalizeSlug = (title) => title.toLowerCase().replace(/\s+/g, '-');

  // Find recipe based on slug
  const recipe = recipes.find(
    (r) => normalizeSlug(r.TitleEN) === slug.toLowerCase()
  );

  if (!recipe) {
    return <div>Recipe not found 😞</div>;
  }

  // Destructure execution steps for both languages
  const executionStepsGR = recipe.ExecutionGR || [];
  const executionStepsEN = recipe.ExecutionEN || [];

  return (
    <div>
      <h1>{recipe.TitleEN}</h1>
      <p>{recipe.ShortDescriptionEN}</p>

      <h2>Execution (Greek)</h2>
      {executionStepsGR.length > 0 ? (
        <ul>
          {executionStepsGR.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      ) : (
        <p>No execution steps available in Greek.</p>
      )}

      <h2>Execution (English)</h2>
      {executionStepsEN.length > 0 ? (
        <ul>
          {executionStepsEN.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      ) : (
        <p>No execution steps available in English.</p>
      )}
    </div>
  );
};

export default RecipePage;
