import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import {extractReviewsFromHtml} from './util/extractReviewsFromHtml';
import {Stack} from "react-bootstrap";
import {GreenIcon} from "./component/GreenIcon.jsx";
import {RedIcon} from "./component/RedIcon.jsx";

const Wrapper = styled.div`
    width: 300px;
    height: 510px;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: white;
    z-index: 9999;
`;

const SlideContainer = styled.div`
    display: flex;
    width: 600px; /* 두 화면 너비 합 (300 + 300) */
    height: 100%;
    transition: transform 0.3s ease;
    transform: ${({step}) => `translateX(${step === 1 ? '0' : '-300px'})`};
`;

const SlidePage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 300px;
    height: 100%;
    padding: 1rem;
    flex-shrink: 0;
    background-color: #F4F3EA;
    overflow-y: auto;
`;


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
        <Wrapper style={{
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