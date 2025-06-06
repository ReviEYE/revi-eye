import React, {useEffect, useState} from 'react';
import styled, {css, keyframes} from 'styled-components';
import {extractReviewsFromHtml} from './util/extractReviewsFromHtml';
import {SlideContainer} from "./component/Slide.jsx";
import {StepOne} from "./page/StepOne.jsx";
import {StepTwo} from "./page/StepTwo.jsx";

const fadeInSlideUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const WrapperStyle = styled.div`
    position: relative;
    width: 300px;
    height: 510px;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    background-color: ${({transparent}) =>
            transparent ? 'rgba(252, 252, 252, 0.3)' : 'rgba(252, 252, 252, 1)'};
    ${({transparent}) =>
            transparent
                    ? css`
                        opacity: 0.3;
                    `
                    : css`
                        opacity: 1;
                    `};
    transition: opacity 0.3s ease;

    animation: ${fadeInSlideUp} 0.3s ease-out;
`;


const ControlButtons = styled.div`
    position: absolute; /* 위에 고정 */
    top: 0;
    left: 0;
    width: 100%;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
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

const Wrapper = ({
                     children,
                     open,
                     step,
                     setStep,
                     transparent,
                     transparencyButtonClickHandler,
                     minimizeButtonClickHandler
                 }) => {

    return (
        <WrapperStyle open={open} transparent={transparent}>
            <ControlButtons>
                <IconButton
                    style={{visibility: step === 2 ? 'visible' : 'hidden'}}
                    onClick={() => setStep(1)}
                >＜</IconButton>
                <div className="d-flex gap-2">
                    <IconButton onClick={transparencyButtonClickHandler}>
                        {transparent ? '☀️' : '🌙'}
                    </IconButton>
                    <IconButton onClick={minimizeButtonClickHandler}>─</IconButton>
                </div>
            </ControlButtons>
            {children}
        </WrapperStyle>
    );
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
            open={open}
            step={step}
            setStep={setStep}
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
                <StepOne isReviewDetectablePage={isReviewDetectablePage}
                         findReviewsButtonHandler={findReviewsButtonHandler}/>
                {/* Step 2: 전환된 화면 */}
                <StepTwo key={step} reviews={reviews} setStep={setStep}
                         findReviewsButtonHandler={findReviewsButtonHandler}></StepTwo>
            </SlideContainer>
        </Wrapper>
    );
};

export default Content;