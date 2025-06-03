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

export const CheckIcon = ({id, show, text}) => {
    const icon = (
        <IconWrapper>
            <StyledIcon/>
        </IconWrapper>
    );

    return show ? (
        <OverlayTrigger overlay={<Tooltip id={id}>{text}</Tooltip>}>
            {icon}
        </OverlayTrigger>
    ) : (
        icon
    );
};