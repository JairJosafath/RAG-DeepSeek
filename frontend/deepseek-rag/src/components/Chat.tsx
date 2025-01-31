import { useState } from "react";
import { fetchChatResponse } from "../api/ChatApi";

export function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "" || isStreaming) return;

    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const responseStream = await fetchChatResponse(input);
      const botMessage = { sender: "Bot", text: "" };

      const reader = responseStream.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          setMessages((prev) => [...prev, botMessage]);
          botMessage.text += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, prev.length - 1),
            botMessage,
          ]);

          // patch fix for streaming bug, multiple responses from the bot
          // remove duplicates

          setMessages((prev) =>
            prev.filter(
              (msg, index, self) =>
                self.findIndex((m) => m.text === msg.text) === index
            )
          );
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded shadow-md">
      <div className="h-full overflow-y-auto border-b p-2 mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-1 ${
              msg.sender === "User" ? "text-right" : "text-left"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          disabled={isStreaming}
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-500 text-white rounded-r"
          disabled={isStreaming}
        >
          {isStreaming ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
