import json
import os
from pydantic import BaseModel, Field

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

class RiskResult(BaseModel):
    risk_score: int = Field(..., description="Calculated risk score 0-100")
    factors: list[str] = Field(..., description="List of risk factors extracted from applicant data")

class RiskAgent:
    """
    Risk Agent: Evaluates the applicant's profile to predict mortality/health risk using an LLM.
    """
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "dummy-key")) if OpenAI else None

    def evaluate_risk(self, applicant_data: dict) -> tuple[int, list]:
        if not self.client or os.environ.get("OPENAI_API_KEY") in [None, "", "dummy-key"]:
            return self._mock_evaluate(applicant_data)

        # Real Agentic Evaluation
        prompt = (
            "You are an expert insurance Risk Agent. Analyze the applicant's profile and estimate their medical/mortality risk. "
            "Output a detailed risk profile."
        )
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": f"Applicant data: {json.dumps(applicant_data)}"}
                ],
                functions=[{
                    "name": "submit_risk",
                    "description": "Submit evaluated risk",
                    "parameters": RiskResult.model_json_schema()
                }],
                function_call={"name": "submit_risk"},
                temperature=0.2
            )
            
            args = json.loads(response.choices[0].message.function_call.arguments)
            res = RiskResult(**args)
            return res.risk_score, res.factors
        except Exception as e:
            print(f"[Risk Agent Fast Fallback]: {e}")
            return self._mock_evaluate(applicant_data)
            
    def _mock_evaluate(self, applicant_data: dict):
        score = 10
        factors = []
        if applicant_data.get("age", 0) > 40:
            score += 15
            factors.append("Age over 40")
        if applicant_data.get("smoker"):
            score += 25
            factors.append("Smoking habit increases risk")
        health = applicant_data.get("health_conditions", [])
        if health:
            score += len(health) * 15
            factors.append(f"Pre-existing conditions: {', '.join(health)}")
            
        return min(100, score), factors

