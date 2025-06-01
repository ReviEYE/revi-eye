import Button from "react-bootstrap/Button";
import {SlidePage} from "../component/Slide.jsx";
import React from "react";
import {TypingText} from "../component/TypingText.jsx";

export const StepTwo = ({reviews, setStep}) => {
    return (
        <SlidePage>
            <h5>탐지 결과</h5>
            {
                reviews.map((review, index) => (
                    <TypingText key={index} text={String(review)}/>
                ))
            }
            <Button onClick={() => setStep(1)} variant="secondary">뒤로</Button>
        </SlidePage>
    )
}