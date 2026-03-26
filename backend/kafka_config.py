import os

KAFKA_ENABLED = os.getenv("KAFKA_ENABLED", "0") == "1"
KAFKA_BROKER_URL = os.getenv("KAFKA_BROKER_URL", "localhost:9092")

# Define Topics
TOPIC_CLAIM_RAW = "claim_raw_submissions"
TOPIC_CLAIM_SCORED = "claim_scored_alerts"
TOPIC_DOCUMENT_UPLOADED = "document_uploaded_stream"
