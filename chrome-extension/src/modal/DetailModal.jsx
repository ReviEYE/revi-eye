import React, {useEffect, useState} from "react";
import {
    Bar,
    BarChart,
    BarLabel,
    BarWrapper,
    CloseButton,
    Footer,
    GraphCard,
    ModalBody,
    ModalContainer,
    ModalTitle,
    Overlay,
    ScoreText,
    SectionTitle,
    SummaryCard,
} from "./DetailModal.styled";

export const DetailModal = ({predictResult, onClose}) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const graphData = {
        score: "0.95",
        bars: [70, 50, 40],
        labels: ["Sim Std", "Sim Mean", "Combined Score"],
    };

    return (
        <Overlay>
            <ModalContainer>
                <ModalTitle>Ranking Visualization</ModalTitle>

                <ModalBody>
                    <SummaryCard>
                        <SectionTitle>분석 요약 정보</SectionTitle>
                        <ul>
                            <li>
                                <strong>최종 유사도 점수:</strong> 0.95
                            </li>
                            <li>
                                <strong>평균 유사도 (Sim Mean):</strong> 높음
                            </li>
                            <li>
                                <strong>표준편차 (Sim Std):</strong> 안정적
                            </li>
                            <li>
                                <strong>결합 점수:</strong> 전체적인 점수가 높고 일관됨
                            </li>
                        </ul>
                    </SummaryCard>

                    <GraphCard>
                        <SectionTitle>Top Rankings Comparison</SectionTitle>
                        <ScoreText>{graphData.score}</ScoreText>

                        <BarChart>
                            {graphData.bars.map((targetHeight, i) => (
                                <BarWrapper key={i}>
                                    <Bar
                                        style={{
                                            height: animated ? `${targetHeight}%` : "0%",
                                        }}
                                    />
                                    <BarLabel>{graphData.labels[i]}</BarLabel>
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