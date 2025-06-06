import styled from "styled-components";
import {FaCheckCircle} from "react-icons/fa";
import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const IconWrapper = styled.div`
    width: 18px;
    height: 18px;
    background-color: #0d6efd; /* 초록색 */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%; /* 원형 배경 */
`;

const StyledIcon = styled(FaCheckCircle)`
    color: white;
    width: 12px;
    height: 12px;
`;

export const CheckIcon = ({id, text}) => {
    return (
        <OverlayTrigger
            overlay={
                <Tooltip
                    id={`tooltip-${id}`}
                    style={{zIndex: 9999}} // 스타일 직접 부여
                >
                    {text}
                </Tooltip>
            }
        >
            <IconWrapper>
                <StyledIcon/>
            </IconWrapper>
        </OverlayTrigger>
    );
};