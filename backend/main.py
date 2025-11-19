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

class ProductRequest(BaseModel):
    product_name: str
    skin_type: str
    skin_tone: str

@app.post("/scan-product")
def scan_product(req: ProductRequest):
    ingredients = get_ingredients_from_product(req.product_name)

    if not ingredients:
        return {"error": "Ingredients not found for this product."}

    ingredients = clean_ingredient_list(ingredients)
    toxicity = predict_toxicity(ingredients)

    product_score, product_status = calculate_product_toxicity(toxicity)

    bad_skin_type = check_skin_type_suitability(ingredients, req.skin_type)
    bad_skin_tone = check_skin_tone_suitability(ingredients, req.skin_tone)

    return {
        "product_name": req.product_name,
        "ingredients": ingredients,
        "toxicity_report": toxicity,
        "product_toxicity_score": product_score,
        "product_status": product_status,
        "not_suitable_for_skin_type": bad_skin_type,
        "not_suitable_for_skin_tone": bad_skin_tone
    }
