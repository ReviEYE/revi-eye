import styled from "styled-components";
import { FaRegTimesCircle } from "react-icons/fa";
import React from "react";

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background-color: #C4302B; /* 빨강 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* 원형 배경 */
`;

const StyledIcon = styled(FaRegTimesCircle)`
  color: white;
  width: 32px;
  height: 32px;
`;

export const RedIcon = () => {
    return (
        <IconWrapper>
            <StyledIcon />
        </IconWrapper>
    );
}