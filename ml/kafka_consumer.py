import sys
import os
import json
import time
from confluent_kafka import Consumer, KafkaError, KafkaException

# Add backend directory to track models and settings
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django
django.setup()

from fraudlens_bridge import detect_fraud
from api.models import Claim, FraudAnalysis, AppUser
from kafka_config import KAFKA_BROKER_URL, TOPIC_CLAIM_RAW, TOPIC_CLAIM_SCORED

# We will import the producer to publish the results back!
from api.kafka_producer import publish_event 

def process_fraud_claim(claim_payload):
    claim_id = claim_payload.get('claim_id')
    print(f"[*] Processing Kafka Payload for Claim: {claim_id}")
    
    # Normally we run the heavy ML model asynchronously here:
    # fraud_result = detect_fraud({ 'claim_amount': claim_payload['amount'], ... })
    # Simulating the ML delay:
    time.sleep(2)  
    
    fraud_result = detect_fraud(str(claim_id))
    print(f"[+] Fraud Engine Completed for {claim_id} - Score: {fraud_result['fraud_probability']}")
    
    # Save to PostgreSQL
    try:
        claim_obj = Claim.objects.get(id=claim_id)
        FraudAnalysis.objects.update_or_create(
            claim=claim_obj,
            defaults={
                'fraud_probability': fraud_result['fraud_probability'],
                'risk_score': int(fraud_result['fraud_probability'] * 100),
                'risk_level': fraud_result['fraud_status'],
            }
        )
        # Re-publish to the 'scored' topic so WebSocket can notify frontend!
        publish_event(TOPIC_CLAIM_SCORED, claim_id, fraud_result)
        
    except Exception as e:
        print(f"[-] Database Error during Kafka sync: {e}")

def start_consumer():
    conf = {
        'bootstrap.servers': KAFKA_BROKER_URL,
        'group.id': 'ml_fraud_inference_group',
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    consumer.subscribe([TOPIC_CLAIM_RAW])

    print(f"[*] ML Consumer Started. Listening on {KAFKA_BROKER_URL} - Topic: {TOPIC_CLAIM_RAW}...")

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None: continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF: continue
                else: raise KafkaException(msg.error())

            # Parse and process
            val = msg.value().decode('utf-8')
            payload = json.loads(val)
            print(f"Received ML Task -> {payload}")
            
            process_fraud_claim(payload)

    except KeyboardInterrupt:
        print("Interrupt received. Stopping...")
    finally:
        consumer.close()

if __name__ == '__main__':
    start_consumer()
