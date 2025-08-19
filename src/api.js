const BASE_URL = "http://localhost:5000"; // Ensure backend is running here

export const fetchQuestion = async () => {
    const response = await fetch(`${BASE_URL}/api/question`);
    return response.json();
};

export const submitAnswer = async (question, answer) => {
    const response = await fetch(`${BASE_URL}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
    });
    return response.json();
};

export const stopInterview = async () => {
    const response = await fetch(`${BASE_URL}/api/stop`);
    return response.json();
};
