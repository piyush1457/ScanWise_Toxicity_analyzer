from fastapi import FastAPI
from pydantic import BaseModel
from fetch_ingredients import get_ingredients_from_product
from toxicity_engine import predict_toxicity
from ingredient_cleaner import clean_ingredient_list
from skin_engine import check_skin_type_suitability, check_skin_tone_suitability
from product_scoring import calculate_product_toxicity

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import Optional, List
from fetch_ingredients import get_ingredients_from_product, search_products

# ... imports ...

class ProductRequest(BaseModel):
    product_name: str
    skin_type: str
    skin_tone: str
    usage_frequency: str = "daily"
    amount_applied: str = "normal"
    ingredients_list: Optional[str] = None # For manual entry

@app.get("/search-products")
def search_products_endpoint(q: str):
    products = search_products(q)
    results = []
    for p in products:
        results.append({
            "product_name": p.get("product_name", "Unknown"),
            "brands": p.get("brands", "Unknown"),
            "image_url": p.get("image_small_url", ""),
            "id": p.get("_id", "")
        })
    return results

@app.post("/scan-product")
def scan_product(req: ProductRequest):
    ingredients = []
    
    if req.ingredients_list:
        # Manual Entry
        ingredients = [i.strip() for i in req.ingredients_list.split(",")]
    else:
        # Auto Fetch
        if not req.product_name or not req.product_name.strip():
             return {"error": "Please enter a product name or ingredients list."}
        ingredients = get_ingredients_from_product(req.product_name)

    if not ingredients:
        return {"error": "Ingredients not found. Please try entering them manually."}

    ingredients = clean_ingredient_list(ingredients)
    # ... rest of the logic ...
    toxicity = predict_toxicity(ingredients)

    # Pass usage parameters to the scoring engine
    product_score, product_status, detailed_score = calculate_product_toxicity(
        toxicity, 
        req.usage_frequency, 
        req.amount_applied
    )

    bad_skin_type = check_skin_type_suitability(ingredients, req.skin_type)
    bad_skin_tone = check_skin_tone_suitability(ingredients, req.skin_tone)

    return {
        "product_name": req.product_name,
        "ingredients": ingredients,
        "toxicity_report": toxicity,
        "product_toxicity_score": product_score,
        "product_status": product_status,
        "detailed_score_breakdown": detailed_score,
        "not_suitable_for_skin_type": bad_skin_type,
        "not_suitable_for_skin_tone": bad_skin_tone
    }
