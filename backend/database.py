from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Default to a local PostgreSQL if available, otherwise an in-memory SQLite for testing to prevent immediate crash if no Postgres available
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/insurance_fraud")

engine = None
SessionLocal = None

try:
    engine = create_engine(DATABASE_URL)
    # Test the connection
    with engine.connect() as conn:
        pass
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    print("Connected to PostgreSQL")
except Exception as e:
    # Fallback for local demo purposes if postgres isn't set up
    print("Failed to connect to PostgreSQL, falling back to SQLite", e)
    SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    print("Connected to SQLite")

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
