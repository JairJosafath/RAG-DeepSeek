export async function fetchChatResponse(query: string) {
  try {
    const response = await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        model: "deepseek-r1:7b",
        num_predict: 1028,
        disable_streaming: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from chatbot");
    }

    return response; // Return raw response for streaming
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    throw error;
  }
}
