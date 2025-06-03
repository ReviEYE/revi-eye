import {Stack} from "react-bootstrap";
import {GreenIcon} from "../component/GreenIcon.jsx";
import Button from "react-bootstrap/Button";
import {RedIcon} from "../component/RedIcon.jsx";
import {SlidePage} from "../component/Slide.jsx";
import React from "react";

export const StepOne = ({isReviewDetectablePage, findReviewsButtonHandler}) => {
    return (
        <SlidePage>
            {
                isReviewDetectablePage ? (
                        <>
                            <Stack gap={3} className="flex-grow-0 align-items-center">
                                <GreenIcon/>
                                <h2>현재 페이지는 지원됩니다.</h2>
                            </Stack>
                            <Button onClick={findReviewsButtonHandler} variant="primary">
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
                            <Button disabled variant="primary">
                                리뷰 탐지하기
                            </Button>
                        </>
                    )
            }
        </SlidePage>
    )
}