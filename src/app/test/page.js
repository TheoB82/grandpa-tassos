"use client";
// src/app/test/page.js

import React, { useState } from "react";
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import the Quill styles

// Categories list for Greek and English
const categoriesGR = [
  { name: "Μεζέδες", path: "/mezedes", en: "Starters" },
  { name: "Κυρίως", path: "/kyrios", en: "Mains" },
  { name: "Ψωμιά & Ζύμες", path: "/psomia-zymes", en: "Breads & Dough" },
  { name: "Μερακλίδικα", path: "/meraklidika", en: "Specials" },
  { name: "Μπάρμπεκιου", path: "/barbekiou", en: "Barbecue" },
  { name: "Εορταστικά", path: "/eortastika", en: "Festive" },
  { name: "Νηστίσιμα", path: "/nistisima", en: "Vegetarian" },
  { name: "Γλυκά", path: "/glyka", en: "Desserts" },
];

const categoriesEN = [
  { name: "Starters", path: "/starters", gr: "Μεζέδες" },
  { name: "Mains", path: "/mains", gr: "Κυρίως" },
  { name: "Breads & Dough", path: "/breads-dough", gr: "Ψωμιά & Ζύμες" },
  { name: "Specials", path: "/specials", gr: "Μερακλίδικα" },
  { name: "Barbecue", path: "/barbecue", gr: "Μπάρμπεκιου" },
  { name: "Festive", path: "/festive", gr: "Εορταστικά" },
  { name: "Vegetarian", path: "/vegetarian", gr: "Νηστίσιμα" },
  { name: "Desserts", path: "/desserts", gr: "Γλυκά" },
];

const RecipeToJson = () => {
  const [categoryGR, setCategoryGR] = useState("");
  const [categoryEN, setCategoryEN] = useState("");
  const [titleGR, setTitleGR] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [shortDescriptionGR, setShortDescriptionGR] = useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = useState("");
  const [ingredientsGR, setIngredientsGR] = useState("");
  const [ingredientsEN, setIngredientsEN] = useState("");
  const [longDescriptionGR, setLongDescriptionGR] = useState("");
  const [longDescriptionEN, setLongDescriptionEN] = useState("");
  const [executionGR, setExecutionGR] = useState("");
  const [executionEN, setExecutionEN] = useState("");
  const [tagsGR, setTagsGR] = useState("");
  const [tagsEN, setTagsEN] = useState("");
  const [linkYT, setLinkYT] = useState("");
  const [date, setDate] = useState("");

  // Function to format the execution text as an ordered list
  const formatExecution = (executionText) => {
    const steps = executionText.split("\n").filter(step => step.trim() !== "");
    return `<ol class="font_8">\n  ${steps
      .map(
        (step) =>
          `<li><p class="font_8">${step.trim()}</p></li>`
      )
      .join("\n  ")}\n</ol>`;
  };

  const generateJson = () => {
    const recipeData = {
      CategoryGR: categoryGR,
      CategoryEN: categoryEN,
      TitleGR: titleGR,
      TitleEN: titleEN,
      ShortDescriptionGR: shortDescriptionGR,
      ShortDescriptionEN: shortDescriptionEN,
      IngredientsGR: ingredientsGR,
      IngredientsEN: ingredientsEN,
      LongDescriptionGR: longDescriptionGR,
      LongDescriptionEN: longDescriptionEN,
      ExecutionGR: formatExecution(executionGR),  // Format the execution steps for Greek
      ExecutionEN: formatExecution(executionEN),  // Format the execution steps for English
      TagsGR: tagsGR,
      TagsEN: tagsEN,
      LinkYT: linkYT,
      Date: date,
    };

    const jsonString = JSON.stringify(recipeData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${titleEN || "recipe"}.json`; // Use the titleEN for the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h1>Create Recipe and Download as JSON</h1>
      <div>
        <label>Category (GR): </label>
        <select
          value={categoryGR}
          onChange={(e) => setCategoryGR(e.target.value)}
        >
          <option value="">Select Category</option>
          {categoriesGR.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Category (EN): </label>
        <select
          value={categoryEN}
          onChange={(e) => setCategoryEN(e.target.value)}
        >
          <option value="">Select Category</option>
          {categoriesEN.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Title (GR): </label>
        <input
          type="text"
          value={titleGR}
          onChange={(e) => setTitleGR(e.target.value)}
        />
      </div>
      <div>
        <label>Title (EN): </label>
        <input
          type="text"
          value={titleEN}
          onChange={(e) => setTitleEN(e.target.value)}
        />
      </div>
      <div>
        <label>Short Description (GR): </label>
        <input
          type="text"
          value={shortDescriptionGR}
          onChange={(e) => setShortDescriptionGR(e.target.value)}
        />
      </div>
      <div>
        <label>Short Description (EN): </label>
        <input
          type="text"
          value={shortDescriptionEN}
          onChange={(e) => setShortDescriptionEN(e.target.value)}
        />
      </div>
      <div>
        <label>Ingredients (GR): </label>
        <ReactQuill
          value={ingredientsGR}
          onChange={(value) => setIngredientsGR(value)}
        />
      </div>
      <div>
        <label>Ingredients (EN): </label>
        <ReactQuill
          value={ingredientsEN}
          onChange={(value) => setIngredientsEN(value)}
        />
      </div>
      <div>
        <label>Long Description (GR): </label>
        <ReactQuill
          value={longDescriptionGR}
          onChange={(value) => setLongDescriptionGR(value)}
        />
      </div>
      <div>
        <label>Long Description (EN): </label>
        <ReactQuill
          value={longDescriptionEN}
          onChange={(value) => setLongDescriptionEN(value)}
        />
      </div>
      <div>
        <label>Execution (GR): </label>
        <ReactQuill
          value={executionGR}
          onChange={(value) => setExecutionGR(value)}
          placeholder="1. First step\n2. Second step\n3. Third step"
        />
      </div>
      <div>
        <label>Execution (EN): </label>
        <ReactQuill
          value={executionEN}
          onChange={(value) => setExecutionEN(value)}
          placeholder="1. First step\n2. Second step\n3. Third step"
        />
      </div>
      <div>
        <label>Tags (GR): </label>
        <input
          type="text"
          value={tagsGR}
          onChange={(e) => setTagsGR(e.target.value)}
        />
      </div>
      <div>
        <label>Tags (EN): </label>
        <input
          type="text"
          value={tagsEN}
          onChange={(e) => setTagsEN(e.target.value)}
        />
      </div>
      <div>
        <label>YouTube Link: </label>
        <input
          type="text"
          value={linkYT}
          onChange={(e) => setLinkYT(e.target.value)}
        />
      </div>
      <div>
        <label>Date: </label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button onClick={generateJson}>Generate JSON</button>
    </div>
  );
};

export default RecipeToJson;
