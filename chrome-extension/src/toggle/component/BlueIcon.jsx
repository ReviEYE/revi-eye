import styled from "styled-components";
import {FaCheckCircle} from "react-icons/fa";
import React from "react";

const IconWrapper = styled.div`
    width: 64px;
    height: 64px;
    background-color: #0d6efd; /* 파란색 */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%; /* 원형 배경 */
`;

const StyledIcon = styled(FaCheckCircle)`
    color: white;
    width: 32px;
    height: 32px;
`;

export const BlueIcon = () => {
    return (
        <IconWrapper>
            <StyledIcon/>
        </IconWrapper>
    );
}