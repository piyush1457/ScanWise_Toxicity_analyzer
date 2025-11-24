import requests

def search_products(query):
    if not query or not query.strip():
        return []
    url = "https://world.openbeautyfacts.org/cgi/search.pl"
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 10  # Limit results
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data.get("products", [])
    except Exception as e:
        print(f"Error fetching products: {e}")
        return []

def get_ingredients_from_product(product_name):
    products = search_products(product_name)

    if not products:
        return None

    # Try to find the first product with ingredients
    for product in products:
        ingredients_text = product.get("ingredients_text")
        if ingredients_text:
             return [i.strip() for i in ingredients_text.split(",")]
    
    return None
