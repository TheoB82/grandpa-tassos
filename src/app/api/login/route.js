import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description, ingredients, category } = req.body;

    if (!title || !description || !ingredients || !category) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newRecipe = {
      title,
      description,
      ingredients,
      category,
      dateAdded: new Date().toISOString(),
    };

    try {
      const filePath = path.resolve("public", "recipes.json");
      const fileData = fs.readFileSync(filePath, "utf-8");
      const recipes = JSON.parse(fileData);
      recipes.push(newRecipe);

      fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2));
      return res.status(200).json({ success: true, message: "Recipe added successfully!" });
    } catch (error) {
      console.error("Error writing to JSON file:", error);
      return res.status(500).json({ success: false, message: "Failed to add recipe" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
