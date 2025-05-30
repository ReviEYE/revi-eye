import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';
import { extractReviewsFromHtml } from './util/extractReviewsFromHtml';
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
  transform: ${({ step }) => `translateX(${step === 1 ? '0' : '-300px'})`};
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
`;


const TypingText = ({ text, children, speed = 50 }) => {
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

  return <div style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</div>;
};

const Content = ({ open }) => {
  const [step, setStep] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
      const handler = (event) => {  
        if (event.data?.action === 'send-dom') {
          const html = event.data.payload;
          const reviews = extractReviewsFromHtml(html);
          console.log(reviews);
        }
  
        if (event.data?.cation === 'ANNOUNCE_NOW_PAGE') {
          const nowPage = event.data.payload;
        }
      };
      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }, []);

  return (
    <Wrapper style={{ opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(20px)', pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
      <SlideContainer step={step}>
        {/* Step 1: 초기 화면 */}
        <SlidePage>
          <Stack gap={3} className="flex-grow-0 align-items-center">
            <GreenIcon/>
            <h2>현재 페이지는 지원됩니다.</h2>
          </Stack>
          <Button onClick={() => {
            window.parent.postMessage({ action: 'request-dom' }, '*');
            setStep(2); // 슬라이드 전환
          }} variant="success">
            리뷰 탐지하기
          </Button>
        </SlidePage>

        {/* Step 2: 전환된 화면 */}
        <SlidePage>
          <h5>탐지 결과</h5>
            <TypingText key={step}>여기에 결과를 보여줄 수 있어요.</TypingText>
          <Button onClick={() => setStep(1)} variant="secondary">뒤로</Button>
        </SlidePage>
      </SlideContainer>
    </Wrapper>
  );
};

export default Content;