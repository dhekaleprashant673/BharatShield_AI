import json
import logging
from confluent_kafka import Producer
from kafka_config import KAFKA_BROKER_URL, KAFKA_ENABLED

logger = logging.getLogger(__name__)

# Initialize single producer instance
producer = None
if KAFKA_ENABLED:
    try:
        producer = Producer({
            'bootstrap.servers': KAFKA_BROKER_URL,
            'client.id': 'bharatshield-fastapi-producer',
            'acks': 'all'
        })
    except Exception as e:
        logger.error(f"Failed to connect to Kafka at {KAFKA_BROKER_URL}: {e}")

def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result. """
    if err is not None:
        logger.error(f'Kafka Message delivery failed: {err}')
    else:
        logger.debug(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def publish_event(topic: str, key: str, value: dict):
    if not KAFKA_ENABLED or producer is None:
        return # Gracefully bypass if Kafka is not active
    
    try:
        json_data = json.dumps(value).encode('utf-8')
        producer.produce(
            topic=topic,
            key=key.encode('utf-8') if key else None,
            value=json_data,
            callback=delivery_report
        )
        producer.poll(0) # trigger delivery callbacks
    except Exception as e:
        logger.error(f"Error publishing to Kafka topic {topic}: {e}")

def flush_producer():
    if producer:
        producer.flush()
