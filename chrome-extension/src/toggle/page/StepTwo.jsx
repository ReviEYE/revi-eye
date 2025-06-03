import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {SlidePage} from "../component/Slide.jsx";
import {Card} from "react-bootstrap";
import styled, {css, keyframes} from "styled-components";
import {v4 as uuidv4} from "uuid";
import {CheckIcon} from "../component/CheckIcon.jsx";

// 카드 초기 등장 애니메이션
const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translate(0, 0) scale(1);
    }
`;

// 카드 삭제 시 위로 날아가는 애니메이션
const flyAway = keyframes`
    to {
        transform: translateY(-150%) scale(0.9);
        opacity: 0;
    }
`;

const StackContainer = styled.div`
    position: relative;
    width: 100%;
    height: 300px;
`;

const CardWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 300px;
    transform: translate(${({zIndex}) => zIndex * 2}px, ${({zIndex}) => zIndex * 2}px);
    z-index: ${({zIndex}) => zIndex};

    ${({isVisible, zIndex}) =>
            isVisible
                    ? css`
                        animation: ${fadeInUp} 0.6s ease-out;
                        animation-delay: ${zIndex * 0.15}s;
                        animation-fill-mode: both;
                    `
                    : css`
                        animation: ${flyAway} 0.5s forwards ease-in;
                    `}
`;

const CardInner = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    transform: ${({flipped}) => (flipped ? "rotateY(180deg)" : "rotateY(0deg)")};
`;

const CardFace = styled(Card)`
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CardFront = styled(CardFace)`
    background: white;
`;

const CardBack = styled(CardFace)`
    background: #f0f0f0;
    transform: rotateY(180deg);
    padding: 1rem;
`;

const TextContent = styled(Card.Text)`
    max-height: 120px;
    overflow-y: auto;
    white-space: pre-wrap;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    z-index: 1;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 1rem;
`;

const ReviewCard = ({review, zIndex, onRemove}) => {
    const [flipped, setFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleRemove = () => {
        setIsVisible(false);
        setTimeout(onRemove, 500); // 애니메이션 후 제거
    };

    return (
        <CardWrapper zIndex={zIndex} isVisible={isVisible}>
            <CardInner flipped={flipped}>
                <CardFront>
                    <Card.Body>
                        <CloseButton onClick={handleRemove}>
                            <CheckIcon id={zIndex} show={true} text={"확인 했으면 클릭!"}/>
                        </CloseButton>
                        <Card.Title>리뷰 {zIndex + 1}</Card.Title>
                        <TextContent>{review}</TextContent>
                        <Button variant="primary" onClick={() => setFlipped(true)}>
                            분석하기
                        </Button>
                    </Card.Body>
                </CardFront>
                <CardBack>
                    <Card.Body>
                        <CloseButton onClick={handleRemove}>
                            <CheckIcon id={zIndex} show={true} text={"확인 했으면 클릭!"}/>
                        </CloseButton>
                        <p>이곳에 분석 내용을 넣을 수 있어요.</p>
                        <Button variant="primary" onClick={() => setFlipped(false)}>
                            돌아가기
                        </Button>
                    </Card.Body>
                </CardBack>
            </CardInner>
        </CardWrapper>
    );
};

export const StepTwo = ({reviews, findReviewsButtonHandler}) => {
    const [cardList, setCardList] = useState([]);

    useEffect(() => {
        setCardList(reviews.map((review) => ({id: uuidv4(), text: review})));
    }, [reviews]);

    const removeCard = (idToRemove) => {
        setCardList((prev) => prev.filter((item) => item.id !== idToRemove));
    };

    return (
        <SlidePage>
            <Wrapper>
                <StackContainer>
                    {cardList.map((item, index) => (
                        <ReviewCard
                            key={item.id}
                            review={item.text}
                            zIndex={cardList.length - index - 1}
                            onRemove={() => removeCard(item.id)}
                        />
                    ))}
                </StackContainer>
                <Button variant="primary" className="w-100" onClick={findReviewsButtonHandler}>
                    다시 로드하기
                </Button>
            </Wrapper>
        </SlidePage>
    );
};