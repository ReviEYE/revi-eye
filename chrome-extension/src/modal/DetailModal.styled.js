import styled from "styled-components";

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    padding: 40px;
`;

export const ModalContainer = styled.div`
    background-color: white;
    color: #0c151d;
    border-radius: 12px;
    padding: 24px;
    max-width: 960px;
    width: 100%;
`;

export const ModalTitle = styled.h2`
    font-size: 22px;
    font-weight: bold;
    line-height: 1.3;
    letter-spacing: -0.015em;
    padding: 20px 16px 12px 16px;
    margin: 0;
`;

export const ModalBody = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;
    padding: 24px 16px;
    flex-wrap: wrap;
`;

export const SummaryCard = styled.div`
    flex: 1;
    min-width: 260px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    border: 1px solid #cddcea;
    border-radius: 8px;
    padding: 24px;
    background-color: #ffffff;

    ul {
        margin: 0;
        padding-left: 20px;
        line-height: 1.6;
        font-size: 14px;
        color: #0c151d;
    }
`;

export const GraphCard = styled.div`
    flex: 1;
    min-width: 260px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid #cddcea;
    border-radius: 8px;
    padding: 24px;
    background-color: #ffffff;
`;

export const SectionTitle = styled.p`
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin: 0;
`;

export const ScoreText = styled.p`
    font-size: 32px;
    font-weight: bold;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
`;

export const BarChart = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    height: 180px;
    padding: 0 12px;
`;

export const BarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    height: 100%;
`;

export const Bar = styled.div`
    width: 24px;
    height: 0%;
    transition: height 0.4s ease;
    background-color: ${({negative}) => (negative ? "#e74c3c" : "#5b8def")};
    position: relative;

    &:hover::after {
        content: attr(data-value) '%';
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        padding: 4px 6px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
    }
`;

export const BarLabel = styled.p`
    font-size: 13px;
    font-weight: bold;
    color: #4574a1;
    letter-spacing: 0.015em;
    margin-top: 8px;
    text-align: center;
`;

export const Footer = styled.div`
    text-align: right;
    padding: 0 16px;
`;

export const CloseButton = styled.button`
    margin-top: 12px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
`;


export const LegendWrapper = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    justify-content: flex-end;
`

export const LegendItemWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`

export const LegendColor = styled.div`
    width: 12px;
    height: 12px;
    background-color: ${(props) => props.color || "#5b8def"};
    border-radius: 2px;
`