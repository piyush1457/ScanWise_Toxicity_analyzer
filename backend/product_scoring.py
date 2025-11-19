def calculate_product_toxicity(toxicity_report):
    if len(toxicity_report) == 0:
        return 0, "SAFE"

    avg_score = sum(i["score"] for i in toxicity_report) / len(toxicity_report)

    if avg_score >= 0.60:
        status = "TOXIC"
    elif avg_score >= 0.30:
        status = "MODERATE"
    else:
        status = "SAFE"

    return avg_score, status
