import { useState, useRef } from "react";

interface FileUploadProps {
  isDarkMode: boolean;
  onFileUploaded: () => void;
}

export function FileUpload({ isDarkMode, onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        setUploadStatus("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadStatus("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      const response = await fetch('/api/document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      
      setFile(null);
      setUploadStatus("Upload successful");
      onFileUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
      <div
        className={`
          flex flex-col items-center justify-center
          border-2 border-dashed rounded-lg p-6
          transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}
          ${isDarkMode && isDragging ? '!bg-blue-900/20' : ''}
          cursor-pointer
        `}
        onClick={openFileDialog}
      >
        <svg
          className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {file ? file.name : 'Drop your PDF file here'}
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          or click to select
        </p>
      </div>

      {file && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className={`
              px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
              ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
            `}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload PDF'
            )}
          </button>
        </div>
      )}

      {uploadStatus && (
        <div className={`mt-4 text-center ${
          uploadStatus.includes("failed")
            ? 'text-red-500'
            : uploadStatus === "Uploading..."
            ? isDarkMode ? 'text-gray-300' : 'text-gray-600'
            : isDarkMode ? 'text-green-400' : 'text-green-600'
        }`}>
          {uploadStatus}
        </div>
      )}
      {error && (
        <div className="mt-4 text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
