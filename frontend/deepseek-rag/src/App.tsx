import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import { EmbeddedFiles } from "./components/EmbeddedFiles";
import { ChatSettings } from "./components/ChatSettings";
import { Model } from "./types/Model";

export interface ModelSettings {
  temperature: number;
  top_p: number;
  top_k: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
  num_predict: number;
}

const defaultSettings: ModelSettings = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
  max_tokens: 2048,
  presence_penalty: 0,
  frequency_penalty: 0,
  num_predict: 2048,
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelSettings, setModelSettings] = useState<ModelSettings>(defaultSettings);

  useEffect(() => {
    // Fetch available models when component mounts
    fetch("/api/models")
      .then((response) => response.json())
      .then((data) => {
        // Filter out embedding models
        const chatModels = data.models.filter((model: Model) => 
          !model.model.includes('embed') && 
          !model.details.family.includes('bert')
        );
        setAvailableModels(chatModels);
        if (chatModels.length > 0) {
          setSelectedModel(chatModels[0].model);
        }
      })
      .catch((error) => console.error("Error fetching models:", error));
  }, []);

  const handleFileUploaded = () => {
    // Trigger refresh of embedded files list
    const event = new Event("refreshEmbeddedFiles");
    window.dispatchEvent(event);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`transition-all duration-300 ${isLeftSidebarOpen ? 'ml-80' : 'ml-0'} ${isChatSettingsOpen ? 'mr-80' : 'mr-0'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Deepseeker-04
              </h1>
              <div className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                {selectedModel}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsChatSettingsOpen(!isChatSettingsOpen)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                } transition-colors duration-200 relative`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {isChatSettingsOpen && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1 translate-x-1" />
                )}
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-600'
                } hover:opacity-80 transition-all duration-200`}
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
          <Chat
            isDarkMode={isDarkMode}
            selectedDocuments={selectedDocuments}
            selectedModel={selectedModel}
            modelSettings={modelSettings}
          />
        </div>
      </div>
      <EmbeddedFiles
        isDarkMode={isDarkMode}
        isOpen={isLeftSidebarOpen}
        onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        selectedDocuments={selectedDocuments}
        onSelectionChange={setSelectedDocuments}
        onFileUploaded={handleFileUploaded}
      />
      <ChatSettings
        isDarkMode={isDarkMode}
        isOpen={isChatSettingsOpen}
        onToggle={() => setIsChatSettingsOpen(!isChatSettingsOpen)}
        selectedModel={selectedModel}
        availableModels={availableModels}
        onModelChange={setSelectedModel}
        modelSettings={modelSettings}
        onSettingsChange={setModelSettings}
      />
    </div>
  );
}
