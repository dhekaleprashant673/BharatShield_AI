import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import warnings
warnings.filterwarnings('ignore')

# TensorFlow for Autoencoder
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.optimizers import Adam

# Sample insurance fraud dataset generation (replace with real data)
def generate_sample_data(n_samples=10000):
    np.random.seed(42)

    # Features
    ages = np.random.normal(45, 15, n_samples).clip(18, 80)
    claim_amounts = np.random.exponential(5000, n_samples).clip(100, 100000)
    policy_types = np.random.choice(['Auto', 'Health', 'Property', 'Life'], n_samples)
    incident_types = np.random.choice(['Accident', 'Theft', 'Medical', 'Damage'], n_samples)
    claim_history = np.random.poisson(1, n_samples)
    policy_duration = np.random.uniform(1, 20, n_samples)
    deductible = np.random.choice([0, 500, 1000, 2000], n_samples)

    # Fraud indicators (hidden patterns)
    fraud_prob = (
        (claim_amounts > 20000) * 0.3 +
        (ages < 25) * 0.2 +
        (claim_history > 3) * 0.25 +
        (policy_duration < 2) * 0.15 +
        np.random.random(n_samples) * 0.1
    ).clip(0, 1)

    is_fraud = (np.random.random(n_samples) < fraud_prob).astype(int)

    # Add some noise and correlations
    claim_amounts = claim_amounts * (1 + is_fraud * np.random.normal(0.5, 0.2, n_samples))

    df = pd.DataFrame({
        'age': ages.astype(int),
        'claim_amount': claim_amounts,
        'policy_type': policy_types,
        'incident_type': incident_types,
        'claim_history': claim_history,
        'policy_duration': policy_duration,
        'deductible': deductible,
        'is_fraud': is_fraud
    })

    return df

# Preprocessing function
def preprocess_data(df):
    # Encode categorical variables
    le_policy = LabelEncoder()
    le_incident = LabelEncoder()

    df['policy_type_encoded'] = le_policy.fit_transform(df['policy_type'])
    df['incident_type_encoded'] = le_incident.fit_transform(df['incident_type'])

    # Select features
    features = ['age', 'claim_amount', 'policy_type_encoded', 'incident_type_encoded',
                'claim_history', 'policy_duration', 'deductible']

    X = df[features]
    y = df['is_fraud']

    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler, le_policy, le_incident

# Autoencoder for Anomaly Detection
def build_autoencoder(input_dim, encoding_dim=4):
    # Encoder
    input_layer = Input(shape=(input_dim,))
    encoded = Dense(encoding_dim, activation='relu')(input_layer)

    # Decoder
    decoded = Dense(input_dim, activation='sigmoid')(encoded)

    # Autoencoder model
    autoencoder = Model(input_layer, decoded)
    autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss='mse')

    return autoencoder

# Train Autoencoder for anomaly detection
def train_autoencoder():
    print("Training Autoencoder for anomaly detection...")
    df = generate_sample_data(10000)

    # Preprocess
    X, y, scaler, le_policy, le_incident = preprocess_data(df)

    # Train only on non-fraud data for anomaly detection
    X_normal = X[y == 0]

    print(f"Training on {len(X_normal)} normal samples")

    # Build and train autoencoder
    autoencoder = build_autoencoder(X.shape[1])
    autoencoder.fit(X_normal, X_normal, epochs=50, batch_size=32, validation_split=0.1, verbose=0)

    # Calculate reconstruction error threshold
    reconstructions = autoencoder.predict(X_normal)
    mse = np.mean(np.power(X_normal - reconstructions, 2), axis=1)
    threshold = np.percentile(mse, 95)  # 95th percentile as threshold

    print(f"Anomaly detection threshold: {threshold:.4f}")

    # Save autoencoder and threshold
    autoencoder.save('autoencoder_model.keras')
    joblib.dump(threshold, 'autoencoder_threshold.pkl')
    joblib.dump(scaler, 'scaler_ae.pkl')
    joblib.dump(le_policy, 'label_encoder_policy_ae.pkl')
    joblib.dump(le_incident, 'label_encoder_incident_ae.pkl')

    print("Autoencoder saved successfully!")

    return autoencoder, threshold, scaler, le_policy, le_incident

# Predict anomaly using Autoencoder
def predict_anomaly(age, claim_amount, policy_type, incident_type,
                    claim_history, policy_duration, deductible):
    try:
        autoencoder = tf.keras.models.load_model('autoencoder_model.keras')
        threshold = joblib.load('autoencoder_threshold.pkl')
        scaler = joblib.load('scaler_ae.pkl')
        le_policy = joblib.load('label_encoder_policy_ae.pkl')
        le_incident = joblib.load('label_encoder_incident_ae.pkl')
    except:
        print("Autoencoder model files not found. Please train the autoencoder first.")
        return None

    # Preprocess input
    policy_encoded = le_policy.transform([policy_type])[0]
    incident_encoded = le_incident.transform([incident_type])[0]

    features = np.array([[age, claim_amount, policy_encoded, incident_encoded,
                         claim_history, policy_duration, deductible]])

    features_scaled = scaler.transform(features)

    # Predict reconstruction
    reconstruction = autoencoder.predict(features_scaled)
    mse = np.mean(np.power(features_scaled - reconstruction, 2), axis=1)[0]

    is_anomaly = mse > threshold

    return {
        'is_anomaly': bool(is_anomaly),
        'reconstruction_error': float(mse),
        'threshold': float(threshold),
        'anomaly_score': float(mse / threshold) if threshold > 0 else 0
    }

# Train the model
def train_fraud_model():
    print("Generating sample insurance fraud dataset...")
    df = generate_sample_data(10000)

    print(f"Dataset shape: {df.shape}")
    print(f"Fraud cases: {df['is_fraud'].sum()} ({df['is_fraud'].mean()*100:.1f}%)")

    # Preprocess
    X, y, scaler, le_policy, le_incident = preprocess_data(df)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training Random Forest model...")

    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )

    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]

    print("\nModel Performance:")
    print(classification_report(y_test, y_pred))
    print(f"AUC-ROC Score: {roc_auc_score(y_test, y_pred_proba):.3f}")

    # Feature importance
    feature_names = ['age', 'claim_amount', 'policy_type', 'incident_type',
                     'claim_history', 'policy_duration', 'deductible']
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nFeature Importance:")
    print(feature_importance)

    # Save model and preprocessors
    print("\nSaving model...")
    joblib.dump(model, 'fraud_detection_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(le_policy, 'label_encoder_policy.pkl')
    joblib.dump(le_incident, 'label_encoder_incident.pkl')

    print("Model saved successfully!")

    return model, scaler, le_policy, le_incident

# Prediction function
def predict_fraud(age, claim_amount, policy_type, incident_type,
                  claim_history, policy_duration, deductible):
    # Load model and preprocessors
    try:
        model = joblib.load('fraud_detection_model.pkl')
        scaler = joblib.load('scaler.pkl')
        le_policy = joblib.load('label_encoder_policy.pkl')
        le_incident = joblib.load('label_encoder_incident.pkl')
    except FileNotFoundError:
        print("Model files not found. Please train the model first.")
        return None

    # Preprocess input
    policy_encoded = le_policy.transform([policy_type])[0]
    incident_encoded = le_incident.transform([incident_type])[0]

    features = np.array([[age, claim_amount, policy_encoded, incident_encoded,
                         claim_history, policy_duration, deductible]])

    features_scaled = scaler.transform(features)

    # Predict
    fraud_probability = model.predict_proba(features_scaled)[0][1]
    is_fraud = model.predict(features_scaled)[0]

    return {
        'is_fraud': bool(is_fraud),
        'fraud_probability': float(fraud_probability),
        'risk_score': int(fraud_probability * 100)
    }

if __name__ == "__main__":
    # Train the supervised model
    train_fraud_model()

    # Train the autoencoder for anomaly detection
    train_autoencoder()

    # Example prediction with supervised model
    print("\nExample Supervised Prediction:")
    result = predict_fraud(
        age=25,
        claim_amount=25000,
        policy_type='Auto',
        incident_type='Accident',
        claim_history=4,
        policy_duration=1.5,
        deductible=500
    )

    if result:
        print(f"Fraud Prediction: {result['is_fraud']}")
        print(f"Fraud Probability: {result['fraud_probability']:.3f}")
        print(f"Risk Score: {result['risk_score']}")

    # Example anomaly detection
    print("\nExample Anomaly Detection:")
    anomaly_result = predict_anomaly(
        age=25,
        claim_amount=25000,
        policy_type='Auto',
        incident_type='Accident',
        claim_history=4,
        policy_duration=1.5,
        deductible=500
    )

    if anomaly_result:
        print(f"Is Anomaly: {anomaly_result['is_anomaly']}")
        print(f"Reconstruction Error: {anomaly_result['reconstruction_error']:.4f}")
        print(f"Anomaly Score: {anomaly_result['anomaly_score']:.2f}")

    print("\nTo use these models in your backend:")
    print("1. Run this script to train and save both models")
    print("2. Import predict_fraud and predict_anomaly functions in your FastAPI app")
    print("3. Use supervised model for known fraud patterns, autoencoder for emerging anomalies")