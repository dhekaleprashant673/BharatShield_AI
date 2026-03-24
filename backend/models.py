from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey
from database import Base
import enum
from datetime import datetime

class FraudStatus(enum.Enum):
    OPEN = "Open"
    REVIEWING = "Reviewing"
    RESOLVED = "Resolved"

class ClaimStatus(enum.Enum):
    PENDING = "Pending"
    UNDER_REVIEW = "Under Review"
    APPROVED = "Approved"
    FLAGGED = "Flagged"
    REJECTED = "Rejected"

class PolicyStatus(enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    CANCELLED = "Cancelled"

class RiskLevel(enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    claim_id = Column(String, index=True)
    fraud_type = Column(String)
    risk_score = Column(Integer)
    status = Column(Enum(FraudStatus), default=FraudStatus.OPEN)
    date = Column(DateTime, default=datetime.utcnow)
    policy_holder = Column(String)
    amount = Column(Float)

class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, index=True)
    policy_holder = Column(String)
    claim_type = Column(String)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(ClaimStatus), default=ClaimStatus.PENDING)
    risk_score = Column(Integer, default=0)
    adjuster = Column(String)
    policy_id = Column(String, index=True)

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, index=True)
    holder = Column(String)
    type = Column(String)
    premium = Column(Float)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(Enum(PolicyStatus), default=PolicyStatus.ACTIVE)
    risk = Column(Enum(RiskLevel), default=RiskLevel.LOW)
    claims_count = Column(Integer, default=0)
    fraud_score = Column(Integer, default=0)
    email = Column(String)
    phone = Column(String)
    coverage_amount = Column(Float)
