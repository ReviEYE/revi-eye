import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import {extractReviewsFromHtml} from './util/extractReviewsFromHtml';
import {Stack} from "react-bootstrap";
import {GreenIcon} from "./component/GreenIcon.jsx";
import {RedIcon} from "./component/RedIcon.jsx";
import {SlideContainer, SlidePage} from "./component/Slide.jsx";

const WrapperStyle = styled.div`
    width: 300px;
    height: 510px;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    background-color: ${({transparent}) => (transparent ? 'rgba(244, 243, 234, 0.3)' : 'rgba(244, 243, 234, 1)')};
    opacity: ${({transparent}) => (transparent ? 0.3 : 1)};
    transition: opacity 0.3s ease;
`;


const ControlButtons = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 6px;
    z-index: 10;
`;


const IconButton = styled.button`
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }
`;

const Wrapper = ({children, transparent, transparencyButtonClickHandler, minimizeButtonClickHandler}) => {

    return (
        <WrapperStyle transparent={transparent}>
            <ControlButtons>
                <IconButton onClick={transparencyButtonClickHandler}>
                    {transparent ? '☀️' : '🌙'}
                </IconButton>
                <IconButton onClick={minimizeButtonClickHandler}>─</IconButton>
            </ControlButtons>
            {children}
        </WrapperStyle>
    );
};


const TypingText = ({text, children, speed = 50}) => {
    const content = text || children || '';
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + content.charAt(i));
            i++;
            if (i >= content.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [content, speed]);

    return <div style={{whiteSpace: 'pre-wrap'}}>{displayedText}</div>;
};

const checkReviewDetectablePage = (nowPage) => {
    const pattern = /^https:\/\/www\.coupang\.com\/vp\/products\/\d+/;
    return pattern.test(nowPage);
}


const Content = ({open}) => {
    const [step, setStep] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [nowPage, setNowPage] = useState('');
    const [transparent, setTransparent] = useState(false);

    const findReviewsButtonHandler = () => {
        window.parent.postMessage({action: 'REQUEST_DOM'}, '*');
        setStep(2); // 슬라이드 전환
    }

    const isReviewDetectablePage = checkReviewDetectablePage(nowPage);

    useEffect(() => {
        const handler = (event) => {
            if (event.data.action === 'ANNOUNCE_NOW_PAGE') setNowPage(event.data.payload);
            if (event.data.action === 'SEND_DOM') setReviews(extractReviewsFromHtml(event.data.payload) ?? []);
        }

        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    return (
        <Wrapper
            transparent={transparent}
            transparencyButtonClickHandler={() => setTransparent((prev) => !prev)}
            minimizeButtonClickHandler={() =>
                window.parent.postMessage({action: 'MINIMIZE'}, '*')
            }
            style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: open ? 'auto' : 'none',
                transition: 'opacity 0.3s ease, transform 0.3s ease'
            }}>
            <SlideContainer step={step}>
                {/* Step 1: 초기 화면 */}
                <SlidePage>
                    {
                        isReviewDetectablePage ? (
                                <>
                                    <Stack gap={3} className="flex-grow-0 align-items-center">
                                        <GreenIcon/>
                                        <h2>현재 페이지는 지원됩니다.</h2>
                                    </Stack>
                                    <Button onClick={findReviewsButtonHandler} variant="success">
                                        리뷰 탐지하기
                                    </Button>
                                </>
                            ) :
                            (
                                <>
                                    <Stack gap={3} className="flex-grow-0 align-items-center">
                                        <RedIcon/>
                                        <h2>현재 페이지는 지원되지 않습니다..</h2>
                                    </Stack>
                                    <Button disabled variant="success">
                                        리뷰 탐지하기
                                    </Button>
                                </>
                            )
                    }

                </SlidePage>

                {/* Step 2: 전환된 화면 */}
                <SlidePage>
                    <h5>탐지 결과</h5>
                    {
                        reviews.map((review, index) => (
                            <TypingText key={index} text={String(review)}/>
                        ))
                    }
                    <Button onClick={() => setStep(1)} variant="secondary">뒤로</Button>
                </SlidePage>
            </SlideContainer>
        </Wrapper>
    );
};

export default Content;