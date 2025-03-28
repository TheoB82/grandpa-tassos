import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const recipes = await req.json();
    const filePath = path.join(process.cwd(), "public", "recipes.json");

    await writeFile(filePath, JSON.stringify(recipes, null, 2));

    return new Response(JSON.stringify({ message: "Recipes saved!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving recipes:", error);
    return new Response(
      JSON.stringify({ message: "Error saving recipes" }),
      { status: 500 }
    );
  }
}
