import os
import sys
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

"""
Training script for Kaggle Crop Recommendation dataset

Expected CSV columns:
  N, P, K, temperature, humidity, ph, rainfall, label

Usage (from agri-connect-backend/ directory):
  - Place the CSV at .\data\Crop_recommendation.csv (default), or
  - Provide a custom path via env var DATASET_PATH or CLI arg:
      python train_kaggle_model.py [optional_path_to_csv]

Outputs:
  - crop_kaggle_model.pkl in the backend root (this is what the API loads)
  - Prints evaluation metrics
"""

DEFAULT_DATASET = os.path.join(os.path.dirname(__file__), 'data', 'Crop_recommendation.csv')
OUTPUT_MODEL = os.path.join(os.path.dirname(__file__), 'crop_kaggle_model.pkl')


def resolve_dataset_path() -> str:
    # Priority: CLI arg > ENV var > default
    if len(sys.argv) > 1:
        return sys.argv[1]
    env_path = os.environ.get('DATASET_PATH')
    if env_path:
        return env_path
    return DEFAULT_DATASET


def load_dataset(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at: {path}")
    df = pd.read_csv(path)
    required = {'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'label'}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")
    return df


def train_and_save(df: pd.DataFrame, output_path: str):
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # A simple but strong baseline: Standardize numeric features + RandomForest
    pipeline = Pipeline([
        ('rf', RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            random_state=42,
            n_jobs=-1
        ))
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc:.4f}")
    print("\nClassification Report:\n")
    print(classification_report(y_test, y_pred))

    joblib.dump(pipeline, output_path)
    print(f"\nSaved model to: {output_path}")


if __name__ == '__main__':
    dataset_path = resolve_dataset_path()
    print(f"Using dataset: {dataset_path}")
    df = load_dataset(dataset_path)
    # Optional: basic sanity display
    print(f"Rows: {len(df)}, Classes: {df['label'].nunique()}")
    print(f"Sample crops: {sorted(df['label'].unique())[:10]} ...")
    train_and_save(df, OUTPUT_MODEL)
