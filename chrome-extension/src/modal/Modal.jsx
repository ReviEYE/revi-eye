import React from "react";

export const DetailModal = ({onClose}) => (
    <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '24px',
    }}>
        <div>
            📣 전체화면 모달입니다
            <br/>
            <button onClick={onClose} style={{marginTop: '20px'}}>닫기</button>
        </div>
    </div>
);