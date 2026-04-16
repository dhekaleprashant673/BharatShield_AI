class DataAgent:
    """
    Data Agent: Responsible for extracting, parsing, and cleaning data 
    from incoming applications (JSON/Forms) and external APIs.
    """
    def process(self, raw_data: dict) -> dict:
        """
        Extract and clean data.
        In a full implementation, this uses OCR, SpaCy/BERT.
        """
        # Basic mock cleaning for demonstration
        cleaned_data = {
            "age": int(raw_data.get("age", 0)),
            "income": float(raw_data.get("income", 0.0)),
            "occupation": str(raw_data.get("occupation", "Unknown")).strip(),
            "smoker": bool(raw_data.get("smoker", False)),
            "past_claims": int(raw_data.get("past_claims", 0)),
            "health_conditions": [c.strip().lower() for c in raw_data.get("health_conditions", [])],
            "policy_type": str(raw_data.get("policy_type", "Life")).strip(),
            "sum_insured": float(raw_data.get("sum_insured", 0.0))
        }
        
        # NLP Extraction Mock (e.g. "Patient has diabetes and hypertension")
        # In MVP we simply map from list, but Data Agent represents the NLP layer
        return cleaned_data
