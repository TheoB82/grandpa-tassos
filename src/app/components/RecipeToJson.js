import { useState } from "react";

export default function RecipeToJson() {
  const [recipe, setRecipe] = useState({
    CategoryGR: "",
    CategoryEN: "",
    Image: "",
    TitleGR: "",
    TitleEN: "",
    ShortDescriptionGR: "",
    ShortDescriptionEN: "",
    IngredientsGR: "",
    IngredientsEN: "",
    LongDescriptionGR: "",
    ExecutionGR: "",
    ExecutionEN: "",
    LinkYT: "",
    TagsGR: "",
    TagsEN: "",
    Date: "",
  });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  // Function to format the Execution fields to the correct HTML format
  const formatExecution = (executionText) => {
    const steps = executionText.split("\n").filter(step => step.trim() !== "");
    return `<ol class="font_8">\n  ${steps
      .map(
        (step) =>
          `<li><p class="font_8">${step.trim()}</p></li>`
      )
      .join("\n  ")}\n</ol>`;
  };

  const handleDownload = () => {
    const formattedRecipe = {
      ...recipe,
      ExecutionGR: formatExecution(recipe.ExecutionGR),
      ExecutionEN: formatExecution(recipe.ExecutionEN),
    };
    const jsonString = JSON.stringify(formattedRecipe, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formattedRecipe.TitleEN || "recipe"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Recipe to JSON Converter</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {Object.keys(recipe).map((key) => (
          <div key={key} className="mb-3">
            <label className="block font-semibold">{key}:</label>
            <textarea
              name={key}
              value={recipe[key]}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
        >
          Download JSON
        </button>
      </div>
    </div>
  );
}
