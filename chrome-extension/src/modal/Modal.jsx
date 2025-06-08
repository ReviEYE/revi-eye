import React, {useEffect, useState} from "react";

export const DetailModal = ({onClose}) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const graphData = {
        score: "0.95",
        bars: [70, 50, 40], // 비율 (퍼센트)
        labels: ["Sim Std", "Sim Mean", "Combined Score"],
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflowY: "auto",
                padding: "40px",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    color: "#0c151d",
                    borderRadius: "12px",
                    padding: "24px",
                    maxWidth: "960px",
                    width: "100%",
                }}
            >
                <h2
                    style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        lineHeight: "1.3",
                        letterSpacing: "-0.015em",
                        padding: "20px 16px 12px 16px",
                        margin: 0,
                    }}
                >
                    Ranking Visualization
                </h2>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "24px",
                        padding: "24px 16px",
                        flexWrap: "wrap",
                    }}
                >
                    {/* 왼쪽 요약 카드 */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: "260px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            border: "1px solid #cddcea",
                            borderRadius: "8px",
                            padding: "24px",
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "16px",
                                fontWeight: 500,
                                lineHeight: "1.5",
                            }}
                        >
                            분석 요약 정보
                        </p>
                        <ul
                            style={{
                                margin: 0,
                                paddingLeft: "20px",
                                lineHeight: "1.6",
                                fontSize: "14px",
                                color: "#0c151d",
                            }}
                        >
                            <li>
                                <strong>최종 유사도 점수:</strong> 0.95
                            </li>
                            <li>
                                <strong>평균 유사도 (Sim Mean):</strong> 높음
                            </li>
                            <li>
                                <strong>표준편차 (Sim Std):</strong> 안정적
                            </li>
                            <li>
                                <strong>결합 점수:</strong> 전체적인 점수가 높고 일관됨
                            </li>
                        </ul>
                    </div>

                    {/* 오른쪽 그래프 카드 */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: "260px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            border: "1px solid #cddcea",
                            borderRadius: "8px",
                            padding: "24px",
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                lineHeight: "1.5",
                                margin: 0,
                            }}
                        >
                            Top Rankings Comparison
                        </p>
                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                lineHeight: "1.2",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                margin: 0,
                            }}
                        >
                            {graphData.score}
                        </p>

                        {/* 막대 그래프 */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                gap: "16px",
                                height: "180px", // 반드시 고정 height
                                padding: "0 12px",
                            }}
                        >
                            {graphData.bars.map((targetHeight, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        flex: 1,
                                        height: "100%",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "100%",
                                            height: animated ? `${targetHeight}%` : "0%",
                                            backgroundColor: "#e6edf4",
                                            borderTop: "2px solid #4574a1",
                                            transition: "height 0.6s ease-out",
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: "bold",
                                            color: "#4574a1",
                                            letterSpacing: "0.015em",
                                            marginTop: "8px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {graphData.labels[i]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{textAlign: "right", padding: "0 16px"}}>
                    <button
                        onClick={onClose}
                        style={{
                            marginTop: "12px",
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};