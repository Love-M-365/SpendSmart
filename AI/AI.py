from fuzzywuzzy import process, fuzz
import pandas as pd

# Load dataset
df = pd.read_csv("DataSet.csv")

# Create lowercase mapping
item_to_category = dict(zip(df['Item'].str.lower(), df['Category']))

# Function to categorize item
def categorize_item(item):
    item_lower = item.lower()

    # 1. Exact match
    if item_lower in item_to_category:
        return item_to_category[item_lower]

    # 2. Fuzzy match
    match, score = process.extractOne(
        item_lower,
        item_to_category.keys(),
        scorer=fuzz.token_sort_ratio
    )

    if score > 85:
        return item_to_category[match]
    else:
        return "Miscellaneous"

# Test items
test_items = ["roll", "kadhai paneer", "paneer", "smartphone", "auto","hostel accomodation", "toothbrush", "shaving cream"]

for item in test_items:
    print(f"{item} → {categorize_item(item)}")
