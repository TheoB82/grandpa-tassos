import json
import re
import os

# Define paths to the public folder
public_folder = os.path.join(os.getcwd(), 'public')
input_file = os.path.join(public_folder, 'recipes.json')  # Path to your original JSON file
output_file = os.path.join(public_folder, 'updated_recipes.json')  # Path to the output file

# Load your original recipes JSON file
with open(input_file, 'r', encoding='utf-8') as file:
    recipes = json.load(file)

# Define a function to process HTML in the Execution fields
def convert_html_to_json(html):
    # Remove HTML tags and split the content by list items or paragraphs
    html = re.sub(r'<ul.*?>|</ul>', '', html)  # Remove <ul> tags
    html = re.sub(r'<li.*?>|</li>', '', html)  # Remove <li> tags
    html = re.sub(r'<.*?>', '', html)  # Remove all other HTML tags
    steps = [step.strip() for step in html.split("\n") if step.strip()]
    return steps

# Process the recipes and convert ExecutionGR and ExecutionEN
for recipe in recipes:
    if 'ExecutionGR' in recipe:
        recipe['ExecutionGR'] = convert_html_to_json(recipe['ExecutionGR'])
    if 'ExecutionEN' in recipe:
        recipe['ExecutionEN'] = convert_html_to_json(recipe['ExecutionEN'])

# Save the modified recipes to a new JSON file
with open(output_file, 'w', encoding='utf-8') as file:
    json.dump(recipes, file, ensure_ascii=False, indent=4)

print(f"Recipes have been processed and saved to '{output_file}'.")
