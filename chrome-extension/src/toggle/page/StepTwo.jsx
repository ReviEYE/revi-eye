import Button from "react-bootstrap/Button";
import {SlidePage} from "../component/Slide.jsx";
import React from "react";
import {Card} from "react-bootstrap";
import styled from "styled-components";

const StackContainer = styled.div`
    position: relative;
    width: 100%;
    height: 400px; /* 카드 겹칠 영역 */
`;

const StackedCard = styled(Card)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: ${({zIndex}) => zIndex};
    transform: translate(${({zIndex}) => zIndex * 5}px, ${({zIndex}) => zIndex * 5}px);
`;

const TextContent = styled(Card.Text)`
    max-height: 120px;
    overflow-y: auto;
    white-space: pre-wrap;
`;

const ReviewCard = ({review, zIndex}) => {
    return (
        <StackedCard zIndex={zIndex}>
            <Card.Body>
                <Card.Title>리뷰 {zIndex + 1}</Card.Title>
                <TextContent>{review}</TextContent>
                <Button variant="primary">분석하기</Button>
            </Card.Body>
        </StackedCard>
    );
};

export const StepTwo = ({reviews, setStep}) => {
    return (
        <SlidePage>
            <h5>탐지 결과</h5>

            <StackContainer>
                {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} zIndex={reviews.length - index - 1}/>
                ))}
            </StackContainer>

            <Button onClick={() => setStep(1)} variant="secondary">
                뒤로
            </Button>
        </SlidePage>
    );
};