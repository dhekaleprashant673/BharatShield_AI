import json
import os
from pydantic import BaseModel, Field

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

class FraudResult(BaseModel):
    fraud_score: int = Field(..., description="Calculated fraud probability 0-100")
    reasons: list[str] = Field(..., description="List of reasons for fraud probability")
    evidence: list[str] = Field(..., description="List of documents needed to verify")

class FraudAgent:
    """
    Fraud Agent: Detects anomalies, fake identities, and data mismatch using an LLM.
    """
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "dummy-key")) if OpenAI else None

    def detect_fraud(self, applicant_data: dict) -> tuple[int, list, list]:
        if not self.client or os.environ.get("OPENAI_API_KEY") in [None, "", "dummy-key"]:
            return self._mock_detect(applicant_data)

        # Real Agentic Evaluation
        prompt = (
            "You are an expert insurance Fraud Agent. Analyze the applicant's profile to detect contradictions, "
            "financial anomalies, or policy abuse (like high past claims vs sum insured). "
            "Output fraud score, detailed reasons, and what verification evidence is required."
        )
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": f"Applicant data: {json.dumps(applicant_data)}"}
                ],
                functions=[{
                    "name": "submit_fraud_check",
                    "description": "Submit fraud evaluation",
                    "parameters": FraudResult.model_json_schema()
                }],
                function_call={"name": "submit_fraud_check"},
                temperature=0.2
            )
            
            args = json.loads(response.choices[0].message.function_call.arguments)
            res = FraudResult(**args)
            return res.fraud_score, res.reasons, res.evidence
        except Exception as e:
            print(f"[Fraud Agent Fast Fallback]: {e}")
            return self._mock_detect(applicant_data)

    def _mock_detect(self, applicant_data: dict):
        fraud_score = 2
        reasons = []
        evidence = []
        
        income = applicant_data.get("income", 0)
        sum_insured = applicant_data.get("sum_insured", 0)
        past_claims = applicant_data.get("past_claims", 0)

        # If sum insured is suspiciously high compared to income
        if income > 0 and sum_insured > (income * 25):
            fraud_score += 40
            reasons.append("Income inconsistency: Sum insured exceeds 25x annual income")
            evidence.extend(["ITR (Income Tax Return) for last 3 years", "Salary Slips"])
            
        if sum_insured == 0:
            fraud_score += 10
            reasons.append("Zero sum insured specified")

        # High frequency of past claims indicates potential policy abuse
        if past_claims > 2:
            fraud_score += 30
            reasons.append("High frequency of past claims")
            evidence.append("Past Claims Validation Report")
            
        return min(100, fraud_score), reasons, evidence

