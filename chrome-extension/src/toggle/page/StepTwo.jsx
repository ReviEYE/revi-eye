import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {SlidePage} from "../component/Slide.jsx";
import {Card, ProgressBar, Spinner} from "react-bootstrap";
import styled, {css, keyframes} from "styled-components";
import {v4 as uuidv4} from "uuid";
import {CheckIcon} from "../component/CheckIcon.jsx";
import {FaRegStar, FaStar, FaStarHalfAlt, FaThumbsUp} from "react-icons/fa";
import {TypingText} from "../component/TypingText.jsx";
import {sendPredictRequest} from "../../api/prediction.api.js";
import {FetchResultToast} from "../component/FetchResultToast.jsx";
import {summarizeOverallResult} from "../util/summarizeOverallResult.js";

// 카드 초기 등장 애니메이션
const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(100px) scale(0.95);
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
    height: 320px;
`;

const CardWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 320px;
    transform: translate(${({zIndex}) => zIndex * 2}px, ${({zIndex}) => zIndex * 2}px);
    z-index: ${({zIndex}) => zIndex};

    ${({isVisible, zIndex}) =>
            isVisible
                    ? css`
                        animation: ${fadeInUp} 0.6s ease-out;
                        animation-delay: ${zIndex * 0.3}s;
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
    border-radius: 24px;
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
    background-color: #eee;
    border-radius: 22px;
    padding: 1rem;
    font-size: 0.7rem;
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

const MetaWrapper = styled.div`
    font-size: 0.7rem;
    margin-bottom: 0.5rem;

    .stars {
        display: flex;
        gap: 1px;
    }

    .meta-line {
        display: flex;
        gap: 4px;
        align-items: center;
    }
`;

const ReviewMetaContent = ({rating, username, date, sellerName}) => {
    const renderStars = (score) => {
        const rating = parseFloat(score) || 0;

        return (
            <div className="stars">
                {[...Array(5)].map((_, i) => {
                    if (i + 1 <= rating) {
                        return <FaStar key={i} color="#ffc107"/>;
                    } else if (i + 0.5 <= rating) {
                        return <FaStarHalfAlt key={i} color="#ffc107"/>;
                    } else {
                        return <FaRegStar key={i} color="#ccc"/>;
                    }
                })}
            </div>
        );
    };

    return (
        <MetaWrapper>
            <div className="meta-line">
                {renderStars(rating)}
                <span>{username}</span>
                <span>{date}</span>
            </div>
            <div>
                <span>{sellerName}</span>
            </div>
        </MetaWrapper>
    );
};

const HelpfulWrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #555;
    margin: 4px 0;
    gap: 4px;
`;

export const HelpfulCountContent = ({helpfulCount}) => {
    return (
        <HelpfulWrapper>
            <FaThumbsUp color="#0d6efd" size={12}/>
            <span>{helpfulCount}명에게 도움이 됐어요</span>
        </HelpfulWrapper>
    );
};

const AnalyzeButton = ({setFlipped, inputText, setResult, setToast}) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const result = await sendPredictRequest(inputText);
            setResult(result);

            setToast({show: true, success: true});
            setFlipped(true);
        } catch (error) {
            console.error(error);
            setToast({show: true, success: false});
            setTimeout(() => setToast((prev) => ({...prev, show: false})), 1500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="primary" size="sm" onClick={handleClick} disabled={loading}>
                {loading ? (
                    <>
                        <Spinner animation="grow" size="sm" className="me-2"/>
                        로딩 중...
                    </>
                ) : (
                    "분석하기"
                )}
            </Button>
        </>
    );
};

const ResultWrapper = styled.div`
    max-height: 280px;
    margin-bottom: 1rem;
    font-size: 0.7rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .review-analyze-text {
        height: 120px;
        padding: 1rem;
        border-radius: 24px;
        background-color: #fff;
    }
`;

const ProgressLabel = styled.div`
    font-size: 0.7rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
`;

export const ReviewAnalyzeResult = ({result}) => {
    const {
        prediction,
        probability,
        features,
        contributions,
    } = result;

    const summarizeText = summarizeOverallResult({probability, contributions});


    const aiRatio = Math.round(probability * 100);
    const humanRatio = 100 - aiRatio;

    return (
        <ResultWrapper>
            <div className="review-analyze-text">
                <TypingText>{summarizeText}</TypingText>
            </div>

            <div>
                <ProgressLabel>AI Generated</ProgressLabel>
                <ProgressBar variant="danger" now={aiRatio} label={`${aiRatio}%`}/>
            </div>

            <div>
                <ProgressLabel>Human Generated</ProgressLabel>
                <ProgressBar variant="success" now={humanRatio} label={`${humanRatio}%`}/>
            </div>
        </ResultWrapper>
    );
};

const ReviewCard = ({review, onRemove}) => {
    const [flipped, setFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [result, setResult] = useState(false);
    const [toast, setToast] = useState({show: false, success: false});

    const handleRemove = () => {
        setIsVisible(false);
        setTimeout(onRemove, 500); // 애니메이션 후 제거
    };

    const zIndex = review.index;

    return (
        <CardWrapper zIndex={zIndex} isVisible={isVisible}>
            <CardInner flipped={flipped}>
                <CardFront>
                    <Card.Header>리뷰 {zIndex + 1}</Card.Header>
                    <Card.Body>
                        <CloseButton onClick={handleRemove}>
                            <CheckIcon id={review.index} text={"확인 했으면 클릭!"}/>
                        </CloseButton>
                        <ReviewMetaContent rating={review.rating} username={review.username} date={review.date}
                                           sellerName={review.sellerName}/>
                        <TextContent className="blockquote mb-0">{review.content}</TextContent>
                        <HelpfulCountContent helpfulCount={review.helpfulCount}/>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm"
                                    onClick={() => window.parent.postMessage({
                                        action: 'FOCUS_REVIEW',
                                        index: zIndex
                                    }, '*')}>
                                원문보기
                            </Button>
                            <AnalyzeButton inputText={review.content} setFlipped={setFlipped} setResult={setResult}
                                           setToast={setToast}/>
                        </div>
                    </Card.Body>
                </CardFront>
                <CardBack key={flipped}>
                    <Card.Body>
                        <CloseButton onClick={handleRemove}>
                            <CheckIcon id={zIndex} text={"확인 했으면 클릭!"}/>
                        </CloseButton>
                        <ReviewAnalyzeResult result={result}/>
                        <div className="d-flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => setFlipped(false)}>
                                돌아가기
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => window.parent.postMessage({
                                action: 'OPEN_MODAL',
                                payload: {result: result}
                            }, '*')}>
                                상세보기
                            </Button>
                        </div>
                    </Card.Body>
                </CardBack>
            </CardInner>
            {toast.show && <FetchResultToast isSuccess={toast.success}/>}
        </CardWrapper>
    );
};

export const StepTwo = ({reviews, findReviewsButtonHandler}) => {
    const [cardList, setCardList] = useState([]);

    useEffect(() => {
        setCardList(reviews.map((review) => ({id: uuidv4(), review: review})));
    }, [reviews]);

    const removeCard = (idToRemove) => {
        setCardList((prev) => prev.filter((item) => item.id !== idToRemove));
    };

    return (
        <SlidePage>
            <Wrapper>
                <StackContainer>
                    {cardList.map((item) => (
                        <ReviewCard
                            key={item.id}
                            review={item.review}
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