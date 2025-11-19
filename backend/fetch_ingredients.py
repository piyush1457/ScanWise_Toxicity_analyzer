import requests

def get_ingredients_from_product(product_name):
    url = "https://world.openbeautyfacts.org/cgi/search.pl"
    params = {
        "search_terms": product_name,
        "search_simple": 1,
        "action": "process",
        "json": 1
    }

    response = requests.get(url, params=params)
    data = response.json()

    # 1. Check if products key exists
    if "products" not in data:
        return None

    # 2. Check if list is empty
    if not data["products"]:
        return None

    product = data["products"][0]

    # 3. Ingredient field may be missing
    ingredients_text = product.get("ingredients_text")

    if not ingredients_text:
        return None

    # 4. Split ingredients
    ingredients = [i.strip() for i in ingredients_text.split(",")]

    return ingredients
