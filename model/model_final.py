import pandas as pd
import numpy as np
import re
from collections import Counter
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import joblib

# ✅ Flow Feature Extractor
sbert = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

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

# ✅ Stylometry Feature Extractor
def extract_stylometry_features(text):
    words = re.findall(r'\b\w+\b', text.lower())
    num_words = len(words)
    if num_words == 0:
        return [0, 0, 0, 0]
    avg_word_len = np.mean([len(w) for w in words])
    ttr = len(set(words)) / num_words
    repeated = sum([1 for cnt in Counter(words).values() if cnt > 1])
    repeat_ratio = repeated / len(set(words))
    return [num_words, avg_word_len, ttr, repeat_ratio]

# ✅ BERT Soft Score Extractor
model_path = "./kluebert-human-ai-review"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
model.eval()

def get_bert_soft_score(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    return probs[0][1].item()

# ✅ Ngram Feature Extractor
def simple_tokenize(text):
    return re.findall(r'\b\w+\b', str(text).lower())

def extract_ngram_features(text):
    words = simple_tokenize(text)
    unigram_count = len(set(words))
    bigrams = list(zip(words, words[1:]))
    bigram_count = len(bigrams)
    bigram_unique = len(set(bigrams))
    bigram_diversity = bigram_unique / bigram_count if bigram_count > 0 else 0
    return [unigram_count, bigram_diversity]

# ✅ 통합 예측 함수 (scaling + weighting 포함)
def predict_and_explain(text, clf, scaler):
    flow = extract_flow_features(text)
    styl = extract_stylometry_features(text)
    bert_score = get_bert_soft_score(text)
    ngram = extract_ngram_features(text)
    
    features_raw = np.array(flow + styl + [bert_score] + ngram).reshape(1, -1)

    # ✅ StandardScaler 적용
    features_scaled = scaler.transform(features_raw)

    # ✅ manual weight 적용
    feature_names = [
        'sim_mean', 'sim_std', 'sim_range', 'valley_count',
        'sentence_length', 'avg_word_length', 'ttr', 'repeat_ratio',
        'bert_soft_score', 'unigram_count', 'bigram_diversity'
    ]

    manual_weights = {
        'sim_mean': 1.0,
        'sim_std': 1.0,
        'sim_range': 1.0,
        'valley_count': 1.5,
        'sentence_length': 0.4,
        'avg_word_length': 0.6,
        'ttr': 0.8,
        'repeat_ratio': 0.8,
        'bert_soft_score': 0.1,
        'unigram_count': 0.8,
        'bigram_diversity': 1.2
    }
    weights_vector = np.array([manual_weights[col] for col in feature_names])
    features_weighted = features_scaled * weights_vector

    # ✅ 예측
    prediction = clf.predict(features_weighted)[0]
    proba = clf.predict_proba(features_weighted)[0][1]

    # ✅ 기여도 출력
    model_weights = clf.coef_[0]
    contributions = features_weighted[0] * model_weights
    explain = sorted(zip(feature_names, features_raw[0], model_weights, contributions), key=lambda x: abs(x[3]), reverse=True)
    
    print("리뷰 판별 결과:", "AI 리뷰" if prediction==1 else "사람 리뷰")
    print(f"AI일 확률 (soft probability): {proba:.4f}\n")
    print("Feature별 기여도:")
    for name, val, weight, contrib in explain:
        print(f"{name:15} | 입력값: {val:.4f} | weight: {weight:.4f} | 기여도: {contrib:.4f}")

# ✅ 모델 및 스케일러 로드
clf = joblib.load("C:/gitroot/MJ_model/final_meta_model_v2.joblib")
scaler = joblib.load("C:/gitroot/MJ_model/final_scaler_v2.joblib")

# ✅ 실전 테스트
test_review = "저는 평소에도 탄산음료를 즐겨 마시는데, 건강 때문에 늘 죄책감을 느끼던 찰나 제로 콜라를 접하게 됐어요. 설탕 없이도 콜라 특유의 맛을 그대로 살렸다는 말에 반신반의하면서 한 캔 마셔봤는데, 와… 진짜 깜짝 놀랐습니다."
predict_and_explain(test_review, clf, scaler)
