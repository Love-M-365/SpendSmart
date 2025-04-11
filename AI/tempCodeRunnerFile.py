from fuzzywuzzy import process, fuzz
import pandas as pd

# Load dataset
df = pd.read_csv("C:\\Users\\Dakshyani Murari\\OneDrive\\Desktop\\spend smart GIT\\SpendSmart\\AI\\DataSet.csv")

# Create lowercase mapping
item_to_category = dict(zip(df['Item'].str.lower(), df['Category']))

# Function to categorize item
def preprocess_item(item):
    # Common descriptors to remove
    remove_words = ["veg", "non-veg", "spicy", "fried", "grilled"]
    item = item.lower()
    for word in remove_words:
        item = item.replace(word, "")
    return item.strip()

def categorize_item(item):
    item_cleaned = preprocess_item(item)

    # 1. Exact match
    if item_cleaned in item_to_category:
        return item_to_category[item_cleaned]

    # 2. Fuzzy match
    match, score = process.extractOne(
        item_cleaned,
        item_to_category.keys(),
        scorer=fuzz.token_sort_ratio
    )

    if score > 85:
        return item_to_category[match]
    else:
        return "Miscellaneous"


# Test items
test_items = ["roll", "Biryani","veg spring roll ", "cheesy twisted potatoes", "auto","hostel accomodation", "toothbrush", "shaving cream"]

for item in test_items:
    print(f"{item} → {categorize_item(item)}")
