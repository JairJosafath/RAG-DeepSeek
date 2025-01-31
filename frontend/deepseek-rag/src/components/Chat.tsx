// components/Chat.tsx
import { useState } from "react";

export function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "User", text: input }]);
    setInput("");

    // Simulated bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "Bot", text: "Hello! How can I help?" }]);
    }, 1000);
  };

  return (
    <div className="w-96 bg-white p-4 rounded shadow-md">
      <div className="h-64 overflow-y-auto border-b p-2 mb-2">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-1 ${msg.sender === "User" ? "text-right" : "text-left"}`}>
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
        />
        <button onClick={sendMessage} className="px-4 bg-blue-500 text-white rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
