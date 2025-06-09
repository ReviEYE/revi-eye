import React, {useEffect, useState} from 'react';
import Toast from 'react-bootstrap/Toast';
import styled, {keyframes} from 'styled-components';
import {FaCheckCircle, FaRegTimesCircle} from 'react-icons/fa';

// 애니메이션 정의
const slideDown = keyframes`
    from {
        top: -40px;
        opacity: 0;
    }
    to {
        top: -10px;
        opacity: 1;
    }
`;

const slideUp = keyframes`
    from {
        top: -10px;
        opacity: 1;
    }
    to {
        top: -40px;
        opacity: 0;
    }
`;

// absolute 위치 기준 Toast Wrapper
const ToastWrapper = styled.div`
    position: absolute; /* ✅ absolute 적용 */
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    border-radius: 24px;
    animation: ${({show}) => (show ? slideDown : slideUp)} 0.4s ease forwards;
`;

// 아이콘 스타일
const IconWrapper = styled.div`
    width: 18px;
    height: 18px;
    background-color: ${({success}) => (success ? '#0d6efd' : '#C4302B')};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
`;

const StyledCheckIcon = styled(FaCheckCircle)`
    color: white;
    width: 10px;
    height: 10px;
`;

const StyledFailIcon = styled(FaRegTimesCircle)`
    color: white;
    width: 10px;
    height: 10px;
`;

const MessageWrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    gap: 6px;
`;

export const FetchResultToast = ({isSuccess}) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        setShow(true);
        const hideTimer = setTimeout(() => setShow(false), 2000);
        return () => clearTimeout(hideTimer);
    }, [isSuccess]);

    return (
        <ToastWrapper show={show}>
            <Toast
                onClose={() => setShow(false)}
                show={show}
                bg="light"
                style={{
                    width: 'auto',
                    maxWidth: 'fit-content',
                    padding: '6px',
                }}
            >
                <Toast.Body style={{padding: '2px 6px'}}>
                    <MessageWrapper>
                        <IconWrapper success={isSuccess}>
                            {isSuccess ? <StyledCheckIcon/> : <StyledFailIcon/>}
                        </IconWrapper>
                        <span>{isSuccess ? '응답 성공' : '응답 실패'}</span>
                    </MessageWrapper>
                </Toast.Body>
            </Toast>
        </ToastWrapper>
    );
};