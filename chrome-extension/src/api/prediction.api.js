const BASE_URL = process.env.REACT_APP_AI_SERVER_BASE_URL || 'http://localhost:8000';

export const sendPredictRequest = async (text) => {
    try {
        const res = await fetch(`${BASE_URL}/predict`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text}),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        // 예측 결과 유효성 확인
        if (!json || typeof json.probability === 'undefined') {
            throw new Error("Invalid response format");
        }

        return json;
    } catch (err) {
        console.error("Error during prediction request:", err);
        throw err;
    }
};