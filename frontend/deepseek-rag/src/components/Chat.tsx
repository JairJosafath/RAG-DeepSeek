import { useState, useRef, useEffect } from "react";
import { ModelSettings } from "../App";

interface ChatProps {
  isDarkMode: boolean;
  selectedDocuments: string[];
  selectedModel: string;
  modelSettings: ModelSettings;
}

interface Message {
  sender: "User" | "Bot";
  text: string;
}

export function Chat({ isDarkMode, selectedDocuments, selectedModel, modelSettings }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "" || isStreaming) return;

    const userMessage: Message = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          selected_documents: selectedDocuments,
          model: selectedModel,
          disable_streaming: false,
          ...modelSettings
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const botMessage: Message = { sender: "Bot", text: "" };
      setMessages((prev) => [...prev, botMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          botMessage.text += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, prev.length - 1),
            { ...botMessage }
          ]);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "Sorry, an error occurred while processing your request." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`h-[500px] overflow-y-auto p-4 ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 animate-fade-in ${
              msg.sender === "User" ? "ml-auto" : "mr-auto"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "User"
                  ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white ml-auto`
                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${isDarkMode ? 'text-white' : 'text-gray-800'}`
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {msg.sender === "User" ? "You" : "Assistant"}
              </div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex flex-col space-y-2">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedDocuments.length === 0 ? (
              <span className="text-yellow-500">⚠️ No documents selected - AI will respond without context</span>
            ) : (
              <span>Using {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} for context</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={`flex-1 p-2 rounded-lg resize-none h-[45px] focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500'
                  : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400'
              }`}
              disabled={isStreaming}
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isStreaming
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-80'
              } ${
                isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {isStreaming ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
