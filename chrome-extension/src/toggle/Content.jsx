import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const ContentStyle = styled.div`
  width: 300px;
  height: 510px;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;

  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(20px)')};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: relative;
`;

const variant = {
    SUCCESS: 'success',
    FAIL: 'warning'
}

const Content = ({ open }) => {
    return (
        <ContentStyle open={open}>
            <Alert style={{ backgroundColor: '#fff' }} key={variant.SUCCESS} variant={variant.SUCCESS}>
                지원 중입니다.
            </Alert>
            <Alert style={{ backgroundColor: '#fff' }} key={variant.FAIL} variant={variant.FAIL}>
                현재 페이지는 지원 되지 않습니다.
            </Alert>
            <Button onClick={() => {
                window.parent.postMessage({ action: 'request-dom' }, '*');
            }} variant="success">리뷰 탐지하기</Button>
        </ContentStyle>
    );
};

export default Content;