export const summarizeOverallResult = ({probability, contributions}) => {
    const {
        sim_mean = 0,
        valley_count = 0,
        avg_word_length = 0,
        ttr = 0,
        repeat_ratio = 0,
        bert_soft_score = 0,
        bigram_diversity = 0,
    } = contributions || {};

    const aiConfidence = probability ?? 0;

    const aiJudgment = (() => {
        if (aiConfidence >= 0.9) return "해당당 리뷰는 AI가 작성했을 가능성이 매우 높습니다.";
        if (aiConfidence >= 0.7) return "AI가 작성했을 가능성이 높은 리뷰입니다.";
        if (aiConfidence >= 0.3) return "AI와 사람이 작성했을 가능성이 비슷해 보입니다.";
        return "사람이 직접 작성했을 가능성이 높은 리뷰입니다.";
    })();

    const reasons = [];

    // AI 작성 근거
    if (sim_mean < 0.75) reasons.push("[AI] 문장 간 연결이 부자연스럽습니다.");
    if (valley_count >= 2) reasons.push("[AI] 글 흐름이 단절되는 구간이 여러 번 나타납니다.");
    if (ttr < 0.5) reasons.push("[AI] 어휘의 다양성이 낮고 반복적입니다.");
    if (repeat_ratio > 0.3) reasons.push("[AI] 같은 단어가 과도하게 반복되어 기계적입니다.");
    if (bert_soft_score < 0.6) reasons.push("[AI] 의미 간 연결이 약해 자연스러움이 부족합니다.");
    if (bigram_diversity < 0.3) reasons.push("[AI] 단어 조합이 다양하지 않아 반복적입니다.");

    // 인간 작성 근거
    if (sim_mean >= 0.75) reasons.push("[사람] 문장 간 흐름이 자연스럽고 연결이 좋습니다.");
    if (valley_count < 2) reasons.push("[사람] 문장 구조가 일관되게 유지됩니다.");
    if (ttr >= 0.5) reasons.push("[사람] 다양한 어휘가 사용되어 어휘력이 돋보입니다.");
    if (repeat_ratio <= 0.3) reasons.push("[사람] 단어 반복이 적고 표현이 다양합니다.");
    if (bert_soft_score >= 0.6) reasons.push("[사람] 문맥 간 의미 연결이 자연스럽습니다.");
    if (bigram_diversity >= 0.3) reasons.push("[사람] 다양한 단어 조합으로 표현력이 풍부합니다.");

    const filterReasons = () => {
        if (aiConfidence >= 0.7) {
            return reasons.filter(r => r.startsWith("[AI]"));
        } else if (aiConfidence < 0.3) {
            return reasons.filter(r => r.startsWith("[사람]"));
        } else {
            return reasons; // 중립일 때 모두 포함
        }
    };

    const explanationList = filterReasons().map(r => r.replace(/^\[\w+\] /, ""));

    return [aiJudgment, ...explanationList].join(" ");
};