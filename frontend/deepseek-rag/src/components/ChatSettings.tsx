import { Model } from "../types/Model";
import { ModelSettings } from "../App";

interface ChatSettingsProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onToggle: () => void;
  selectedModel: string;
  availableModels: Model[];
  onModelChange: (model: string) => void;
  modelSettings: ModelSettings;
  onSettingsChange: (settings: ModelSettings) => void;
}

export function ChatSettings({ 
  isDarkMode, 
  isOpen, 
  onToggle,
  selectedModel,
  availableModels,
  onModelChange,
  modelSettings,
  onSettingsChange 
}: ChatSettingsProps) {
  const handleSettingChange = (key: keyof ModelSettings, value: number) => {
    onSettingsChange({
      ...modelSettings,
      [key]: value
    });
  };

  const renderSlider = (
    key: keyof ModelSettings,
    label: string,
    min: number,
    max: number,
    step: number
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        {label}: {modelSettings[key]}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={modelSettings[key]}
        onChange={(e) => handleSettingChange(key, parseFloat(e.target.value))}
        className={`w-full ${isDarkMode ? 'accent-blue-500' : 'accent-blue-600'}`}
      />
      <div className="flex justify-between text-xs mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-80 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} shadow-lg z-20`}
    >
      <button
        onClick={onToggle}
        className={`absolute left-0 top-1/2 -translate-x-full transform rounded-l-lg p-2 shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
        }`}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
          />
        </svg>
      </button>

      <div className="h-full overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Chat Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Model Selection</label>
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className={`w-full p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {availableModels.map((model) => (
                <option key={model.digest} value={model.model}>
                  {model.model} ({model.details.parameter_size})
                </option>
              ))}
            </select>
            {selectedModel && (
              <div className="mt-4 text-sm">
                {availableModels.map((model) => 
                  model.model === selectedModel && (
                    <div key={model.digest} className="space-y-2">
                      <p><span className="font-medium">Family:</span> {model.details.family}</p>
                      <p><span className="font-medium">Size:</span> {model.details.parameter_size}</p>
                      <p><span className="font-medium">Quantization:</span> {model.details.quantization_level}</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Generation Settings</h3>
            {renderSlider("temperature", "Temperature", 0, 2, 0.1)}
            {renderSlider("top_p", "Top P", 0, 1, 0.05)}
            {renderSlider("top_k", "Top K", 1, 100, 1)}
            {renderSlider("num_predict", "Number of Tokens to Generate", 64, 4096, 64)}
            {renderSlider("max_tokens", "Max Context Tokens", 64, 4096, 64)}
            {renderSlider("presence_penalty", "Presence Penalty", -2, 2, 0.1)}
            {renderSlider("frequency_penalty", "Frequency Penalty", -2, 2, 0.1)}
          </div>
        </div>
      </div>
    </div>
  );
} 