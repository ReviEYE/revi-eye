from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import re
from collections import Counter
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import joblib

app = FastAPI()

### ===== 모델 및 사전 객체 준비 ===== ###

# Flow feature SBERT
sbert = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# BERT soft score 모델
model_path = "C:/gitroot/kluebert-human-ai-review"
tokenizer = AutoTokenizer.from_pretrained(model_path)
bert_model = AutoModelForSequenceClassification.from_pretrained(model_path)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
bert_model.to(device)
bert_model.eval()

# 최종 meta 모델 & 스케일러
clf = joblib.load("C:/gitroot/MJ_model/final_meta_model_v2.joblib")
scaler = joblib.load("C:/gitroot/MJ_model/final_scaler_v2.joblib")

# Feature config
feature_names = [
    'sim_mean', 'sim_std', 'sim_range', 'valley_count',
    'sentence_length', 'avg_word_length', 'ttr', 'repeat_ratio',
    'bert_soft_score', 'unigram_count', 'bigram_diversity'
]

manual_weights = {
    'sim_mean': 1.0, 'sim_std': 1.0, 'sim_range': 1.0, 'valley_count': 1.5,
    'sentence_length': 0.4, 'avg_word_length': 0.6, 'ttr': 0.8, 'repeat_ratio': 0.8,
    'bert_soft_score': 0.05, 'unigram_count': 1.2, 'bigram_diversity': 1.2
}
weights_vector = np.array([manual_weights[col] for col in feature_names])


### ===== feature extractor ===== ###

def split_sentences(text, chunk_size=15):
    words = str(text).split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

def extract_flow_features(text):
    sentences = split_sentences(text)
    if len(sentences) < 2:
        return [0, 0, 0, 0]
    embeddings = sbert.encode(sentences)
    similarities = [cosine_similarity([embeddings[i]], [embeddings[i+1]])[0][0] for i in range(len(embeddings)-1)]
    sim_mean = np.mean(similarities)
    sim_std = np.std(similarities)
    sim_range = np.max(similarities) - np.min(similarities)
    valley_count = sum(1 for i in range(1, len(similarities)-1) if similarities[i] < similarities[i-1] and similarities[i] < similarities[i+1])
    return [sim_mean, sim_std, sim_range, valley_count]

def extract_stylometry_features(text):
    words = re.findall(r'\b\w+\b', text.lower())
    num_words = len(words)
    if num_words == 0: return [0, 0, 0, 0]
    avg_word_len = np.mean([len(w) for w in words])
    ttr = len(set(words)) / num_words
    repeated = sum([1 for cnt in Counter(words).values() if cnt > 1])
    repeat_ratio = repeated / len(set(words))
    return [num_words, avg_word_len, ttr, repeat_ratio]

def extract_ngram_features(text):
    words = re.findall(r'\b\w+\b', text.lower())
    unigram_count = len(set(words))
    bigrams = list(zip(words, words[1:]))
    bigram_count = len(bigrams)
    bigram_unique = len(set(bigrams))
    bigram_diversity = bigram_unique / bigram_count if bigram_count > 0 else 0
    return [unigram_count, bigram_diversity]

def get_bert_soft_score(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
    with torch.no_grad():
        outputs = bert_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    return probs[0][1].item()

def extract_full_features(text):
    flow = extract_flow_features(text)
    styl = extract_stylometry_features(text)
    ngram = extract_ngram_features(text)
    bert_score = get_bert_soft_score(text)
    return np.array(flow + styl + [bert_score] + ngram).reshape(1, -1)

### ===== Input Request schema ===== ###
class ReviewRequest(BaseModel):
    text: str

### ===== API 엔드포인트 구현 ===== ###

@app.post("/predict")
def predict(request: ReviewRequest):
    text = request.text

    features_raw = extract_full_features(text)
    features_scaled = scaler.transform(features_raw)
    features_weighted = features_scaled * weights_vector

    pred = clf.predict(features_weighted)[0]
    proba = clf.predict_proba(features_weighted)[0][1]
    model_weights = clf.coef_[0]
    contributions = features_weighted[0] * model_weights

    return {
        "prediction": int(pred),
        "probability": float(proba),
        "features": dict(zip(feature_names, features_raw[0].round(4))),
        "contributions": dict(zip(feature_names, contributions.round(4)))
    }
