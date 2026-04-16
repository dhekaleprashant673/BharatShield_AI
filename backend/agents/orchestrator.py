import os
import json
from pydantic import BaseModel, Field
from typing import List, Optional

from agents.data_agent import DataAgent
from agents.risk_agent import RiskAgent
from agents.fraud_agent import FraudAgent

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "dummy-key")) if OpenAI else None

class UnderwritingRequest(BaseModel):
    age: int
    income: float
    occupation: str
    health_conditions: List[str]
    smoker: bool
    past_claims: int
    policy_type: str
    sum_insured: float

class AgentDecision(BaseModel):
    risk_score: int = Field(..., description="Risk score from 0 to 100")
    fraud_probability: int = Field(..., description="Probability of fraud from 0 to 100")
    decision: str = Field(..., description="One of: 'Approved', 'Rejected', 'Manual Review Required'")
    reason: List[str] = Field(..., description="List of reasons for the decision")
    evidence_required: List[str] = Field(..., description="List of additional documents or evidence needed")


class UnderwritingOrchestrator:
    """
    The Main Brain Orchestrator Agent (CORE) for BharatShield AI.
    Executes Phase 2 Agentic AI Integration: routes via Data, Risk, and Fraud Agents
    to render a final decision using the Adaptive Evidence Engine.
    """
    
    def __init__(self):
        self.data_agent = DataAgent()
        self.risk_agent = RiskAgent()
        self.fraud_agent = FraudAgent()
        self.client = client

    def evaluate(self, request: UnderwritingRequest) -> AgentDecision:
        """
        Evaluate the context and orchestrate the decision flow.
        User Input -> Data Agent -> Orchestrator -> Risk/Fraud Agents -> Decision
        """
        # --- PHASE 2: Multi-Agent Coordination Flow ---
        
        # 1. Data Agent extracts and cleans
        raw_data = request.model_dump()
        cleaned_data = self.data_agent.process(raw_data)
        
        # 2. Parallel Evaluation (Simulated sequential here)
        risk_score, risk_factors = self.risk_agent.evaluate_risk(cleaned_data)
        fraud_score, fraud_reasons, evidence = self.fraud_agent.detect_fraud(cleaned_data)
        
        # 3. Aggregation & Decision Engine
        all_reasons = risk_factors + fraud_reasons
        
        # Adaptive Evidence Engine rule: request medical docs only if high risk
        if risk_score > 35:
            evidence.append("Full Medical Report (last 6 months)")
            if cleaned_data["smoker"]:
                evidence.append("Recent cotinine test")

        decision = "Manual Review Required"
        
        if risk_score < 30 and fraud_score < 20:
            decision = "Approved"
            evidence = []
            all_reasons.append("Low risk and high confidence. Cleared by automated underwriting.")
        elif risk_score > 70 or fraud_score > 50:
            decision = "Manual Review Required"
            all_reasons.append("Anomalous pattern detected requires underwriter oversight.")
        else:
            decision = "Manual Review Required"
            all_reasons.append("Moderate risk detected. Manual oversight suggested.")
            
        # Clean up duplicates
        evidence = list(set(evidence))

        return AgentDecision(
            risk_score=risk_score,
            fraud_probability=fraud_score,
            decision=decision,
            reason=all_reasons,
            evidence_required=evidence
        )
