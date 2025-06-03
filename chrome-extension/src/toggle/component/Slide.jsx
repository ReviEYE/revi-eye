import styled from "styled-components";

export const SlideContainer = styled.div`
    display: flex;
    width: 600px; /* 두 화면 너비 합 (300 + 300) */
    height: 100%;
    transition: transform 0.3s ease;
    transform: ${({step}) => `translateX(${step === 1 ? '0' : '-300px'})`};
`;

export const SlidePage = styled.div`
    width: 300px;
    height: 100%;
`;




