export const analyzeReviewIndicators = ({contributions}) => {
    const {
        sim_mean,
        std,
        range,
        valley_count,
        sentence_length,
        avg_word_length,
        ttr,
        repeat_ratio,
        bert_soft_score,
        unigram_count,
        bigram_diversity
    } = contributions;

    const explanations = [];

    // 1. 코사인 유사도 흐름
    if (sim_mean < 0.75) {
        explanations.push("리뷰 전체의 문장 간 연결성이 낮아 자연스러운 흐름이 부족해 보입니다.");
    } else {
        explanations.push("문장 간 연결성이 높아 비교적 자연스러운 흐름을 유지하고 있습니다.");
    }

    // 2. valley_count
    if (valley_count >= 2) {
        explanations.push("문장 사이의 의미 단절이 여러 번 감지되어 두서없는 글일 가능성이 있습니다.");
    } else {
        explanations.push("문장 흐름이 비교적 일관되게 유지되고 있습니다.");
    }

    // 3. 단어 수준 지표
    if (avg_word_length > 5) {
        explanations.push("단어의 평균 길이가 길어 비교적 전문적인 표현이 사용되었습니다.");
    } else {
        explanations.push("짧은 단어들이 주로 사용되어 간결한 표현이 많습니다.");
    }

    // 4. 고유어 비율 (TTR)
    if (ttr < 0.5) {
        explanations.push("다양한 어휘보다는 반복적인 표현이 많아 어휘 다양성이 낮습니다.");
    } else {
        explanations.push("다양한 어휘가 사용되어 어휘력 면에서 인간 작성의 가능성이 있습니다.");
    }

    // 5. 반복 비율
    if (repeat_ratio > 0.3) {
        explanations.push("동일한 단어가 반복적으로 사용되어 기계 생성 가능성이 있습니다.");
    }

    // 6. BERT Soft Score
    if (bert_soft_score < 0.6) {
        explanations.push("의미적 일관성이 낮아 AI가 자동 생성했을 가능성이 있습니다.");
    } else {
        explanations.push("문맥 간 의미가 유사하게 유지되어 자연스러운 표현입니다.");
    }

    // 7. bigram 다양성
    if (bigram_diversity < 0.3) {
        explanations.push("문장 내 단어 조합이 다양하지 않아 기계적인 표현이 사용되었을 가능성이 있습니다.");
    } else {
        explanations.push("다양한 단어 조합이 사용되어 자연스러운 표현입니다.");
    }

    return explanations;
}