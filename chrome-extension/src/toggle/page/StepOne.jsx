import React from "react";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import {BlueIcon} from "../component/BlueIcon.jsx";
import {RedIcon} from "../component/RedIcon.jsx";
import {SlidePage} from "../component/Slide.jsx";
import {Spinner} from "react-bootstrap";

// 전체 화면을 채우고 세로 정렬을 위한 Wrapper
const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
`;

// 메시지와 아이콘을 담을 중앙 영역
const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: auto;
    margin-bottom: auto;
`;

export const StepOne = ({nowPage, isReviewDetectablePage, findReviewsButtonHandler}) => {
    const isLoading = nowPage === '';

    return (
        <SlidePage>
            <Wrapper>
                {isLoading ? (
                    <Content>
                        <Spinner animation="grow" role="status"/>
                        <div>페이지 정보를 불러오는 중...</div>
                    </Content>
                ) : (
                    <>
                        <Content>
                            {isReviewDetectablePage ? (
                                <>
                                    <BlueIcon/>
                                    <h2>현재 페이지는 지원됩니다.</h2>
                                </>
                            ) : (
                                <>
                                    <RedIcon/>
                                    <h2>현재 페이지는 지원되지 않습니다.</h2>
                                </>
                            )}
                        </Content>
                        <Button
                            onClick={findReviewsButtonHandler}
                            variant="primary"
                            disabled={!isReviewDetectablePage}
                        >
                            리뷰 탐지하기
                        </Button>
                    </>
                )}
            </Wrapper>
        </SlidePage>
    );
};