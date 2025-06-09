import React, {useEffect, useState} from "react";
import {
    Bar,
    BarChart,
    BarLabel,
    BarWrapper,
    CloseButton,
    Footer,
    GraphCard,
    LegendColor,
    LegendItemWrapper,
    LegendWrapper,
    ModalBody,
    ModalContainer,
    ModalTitle,
    Overlay,
    ScoreText,
    SectionTitle,
    SummaryCard,
} from "./DetailModal.styled";

const getIndicatorExplanation = ({key, value}) => {
    switch (key) {
        case "sim_mean":
            return value < 0.75
                ? "문장 간 연결성이 낮아 흐름이 어색할 수 있습니다."
                : "문장 간 연결성이 높아 자연스러운 흐름을 유지합니다.";
        case "valley_count":
            return value >= 2
                ? "문장 사이의 의미 단절이 자주 발생해 두서없을 수 있습니다."
                : "문장 흐름이 일관적입니다.";
        case "avg_word_length":
            return value > 5
                ? "평균 단어 길이가 길어 전문적인 느낌을 줍니다."
                : "짧고 간결한 단어로 구성되어 있습니다.";
        case "ttr":
            return value < 0.5
                ? "어휘 다양성이 낮아 반복적일 수 있습니다."
                : "다양한 어휘가 사용되었습니다.";
        case "repeat_ratio":
            return value > 0.3
                ? "반복되는 단어가 많아 기계적일 수 있습니다."
                : "반복 표현이 적어 자연스럽습니다.";
        case "bert_soft_score":
            return value < 0.6
                ? "의미 일관성이 낮아 AI 작성 가능성이 있습니다."
                : "의미 연결이 자연스럽습니다.";
        case "bigram_diversity":
            return value < 0.3
                ? "표현 방식이 단조로워 보입니다."
                : "다양한 표현이 사용되었습니다.";
        default:
            return null;
    }
};

export const DetailModal = ({predictionResult, onClose}) => {
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const {
        sim_mean = 0,
        valley_count = 0,
        avg_word_length = 0,
        ttr = 0,
        repeat_ratio = 0,
        bert_soft_score = 0,
        bigram_diversity = 0,
    } = predictionResult?.contributions || {};

    const indicators = [
        {key: "sim_mean", value: sim_mean, label: "문장 연결성"},
        {key: "valley_count", value: valley_count, label: "의미 단절"},
        {key: "avg_word_length", value: avg_word_length, label: "단어 길이"},
        {key: "ttr", value: ttr, label: "어휘 다양성"},
        {key: "repeat_ratio", value: repeat_ratio, label: "단어 반복"},
        {key: "bert_soft_score", value: bert_soft_score, label: "의미 일관성"},
        {key: "bigram_diversity", value: bigram_diversity, label: "표현 다양성"},
    ];

    console.log(predictionResult?.contributions);

    const aiScore = (predictionResult.probability || 0) * 100;

    return (
        <Overlay>
            <ModalContainer>
                <ModalTitle>리뷰 분석 상세 결과</ModalTitle>

                <ModalBody>
                    <SummaryCard>
                        <ul>
                            {indicators.map(({key, value}) => (
                                <li key={key}>
                                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                    {getIndicatorExplanation({key, value})}
                                </li>
                            ))}
                        </ul>
                    </SummaryCard>

                    <GraphCard>
                        <SectionTitle>{aiScore >= 50 ? "AI 작성 가능성" : "사람 작성 가능성"}</SectionTitle>
                        <ScoreText>{aiScore >= 50 ? aiScore.toFixed(2) : (100 - aiScore).toFixed(2)}%</ScoreText>
                        <LegendWrapper>
                            <LegendItemWrapper>
                                <LegendColor color={"#5b8def"}/>
                                <span>사람 작성 특징</span>
                            </LegendItemWrapper>
                            <LegendItemWrapper>
                                <LegendColor color={"#e74c3c"}/>
                                <span>AI 작성 특징</span>
                            </LegendItemWrapper>
                        </LegendWrapper>

                        <BarChart>
                            {indicators.map(({key, value, label}) => (
                                <BarWrapper key={key}>
                                    <Bar
                                        data-value={((value * 100)).toFixed(2)}
                                        negative={value < 0}
                                        style={{
                                            height: animated ? `${Math.min(Math.abs(value * 100), 100)}%` : "0%",
                                        }}
                                    />
                                    <BarLabel>{label}</BarLabel>
                                </BarWrapper>
                            ))}
                        </BarChart>
                    </GraphCard>
                </ModalBody>

                <Footer>
                    <CloseButton onClick={onClose}>닫기</CloseButton>
                </Footer>
            </ModalContainer>
        </Overlay>
    );
};