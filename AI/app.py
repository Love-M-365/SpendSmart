from flask import Flask, request, jsonify
from fuzzywuzzy import process, fuzz
import pandas as pd
import os

from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for the entire app
CORS(app)



# Load dataset
csv_path = os.path.join(os.path.dirname(__file__), "DataSet.csv")
df = pd.read_csv(csv_path)
item_to_category = dict(zip(df['Item'].str.lower(), df['Category']))

# Descriptors and Brands
remove_words = ["veg", "non-veg", "non veg", "spicy", "fried", "grilled", "chilled", "hot"]
brands = [  # Dairy & Beverages
    "amul", "mother dairy", "nestle", "britannia", "parag", "gopaljee", "danone", "yakult",

    # Household & Cleaning
    "vim", "surf excel", "rin", "ariel", "tide", "comfort", "harpic", "lizol", "domex", "hit", "odonil",
    "air wick", "ambi pur",
    
    # 🧀 Dairy & Milk Products
    "amul", "mother dairy", "nestle", "britannia", "parag", "gopaljee", "danone", "yakult",
    "aavin", "nandini", "heritage", "verka", "gokul", "milky mist", "kwality", "dudhsagar",
    
    # 🍜 Snacks & Instant Food
    "Maggi", "yippee", "top ramen", "knorr", "sunfeast", "haldiram", "kurkure", "lays",
    "bingo", "parle", "balaji", "craxx", "2 pm noodles", "act ii", "unibic", "tasties",
    "pringles", "cheetos", "doritos",

    # 🍫 Chocolates & Sweets
    "cadbury", "dairy milk", "perk", "5 star", "munch", "kitkat", "milky bar", "ferrero rocher",
    "toblerone", "galaxy", "bournville", "hershey", "amul dark chocolate", "lindt", "nestle chocolate",

    # 🥤 Beverages (Soft Drinks, Juices, Water, Energy Drinks)
    "coca cola", "pepsi", "sprite", "thumbs up", "limca", "mountain dew", "real",
    "tropicana", "frooti", "maaza", "paper boat", "bisleri", "kinley", "aquafina", "bailey",
    "red bull", "monster", "sting", "appsfizz", "slice", "seven up", "bovonto", "rooh afza",
    
    # ☕ Tea & Coffee
    "tata tea", "taj mahal tea", "red label", "brooke bond", "society tea", "bru", "nescafe",
    "leo coffee", "continental coffee", "coffee day", "davidoff coffee",

    # 🧼 Personal Care
    "dove", "Stayfree","whisper","lifebuoy", "patanjali", "himalaya", "garnier", "vaseline", "dettol", "lux",
    "fiama", "pears", "ponds", "nivea", "gilette", "rexona", "liril", "cinthol", "medimix",
    "boroline", "boroplus", "dabur", "vicco", "amul body lotion", "mamaearth", "wow skin", "biotique",
    
    # 🪥 Oral Care
    "colgate", "oral b", "closeup", "dabur red", "sensodyne", "anchor", "meswak", "babool",
    
    # 🧽 Home & Laundry
    "vim", "surf excel", "ariel", "rin", "tide", "nirma", "wheel", "ghadi", "comfort",
    "harpic", "lizol", "domex", "hit", "mortein", "odonil", "air wick", "ambi pur",
    
    # 👶 Baby & Kids
    "johnson & johnson", "pampers", "huggies", "mamy poko", "sebamed", "mee mee",

    # 🛍️ Miscellaneous / Retail
    "big bazaar", "dmart", "reliance smart", "spencer's", "more", "grofers", "blinkit",
    
    # 🍯 Other food brands
    "mdh", "everest", "catch", "badshah", "fortune", "aashirvaad", "saffola", "dhara", "engine", 
    "dabur honey", "sundrop", "nutella", "veeba", "kissan", "funfoods", "american garden",
    "del monte", "hershey's", "nestle milkmaid", "kwality walls", "havmor", "vadilal" ]  # Paste your full brands list here

def preprocess_item(item):
    item = item.lower()
    for word in remove_words:
        item = item.replace(word, "")
    for brand in brands:
        if brand.lower() in item:
            item = item.replace(brand.lower(), "")
    item = " ".join(item.split())
    return item.strip()

def categorize_item(item):
    item_cleaned = preprocess_item(item)
    if item_cleaned in item_to_category:
        return item_to_category[item_cleaned]
    match, score = process.extractOne(item_cleaned, item_to_category.keys(), scorer=fuzz.token_sort_ratio)
    if score > 80:
        return item_to_category[match]
    for word in item_cleaned.split():
        match, score = process.extractOne(word, item_to_category.keys(), scorer=fuzz.token_sort_ratio)
        if score > 85:
            return item_to_category[match]
    return "Miscellaneous"

@app.route("/categorize", methods=["POST"])
def categorize():
    data = request.json
    item = data.get("item", "")
    if not item:
        return jsonify({"error": "No item provided"}), 400
    category = categorize_item(item)
    return jsonify({"category": category})

@app.route('/predict-category', methods=['POST'])
def predict_category():
    data = request.get_json()
    input_text = data.get('text', '').lower()

    # Fuzzy match
    best_match, score = process.extractOne(input_text, item_to_category.keys(), scorer=fuzz.partial_ratio)

    if score >= 70:
        category = item_to_category.get(best_match)
    else:
        category = "Unknown"

    return jsonify({"category": category})

if __name__ == "__main__":
    app.run(port=5001)