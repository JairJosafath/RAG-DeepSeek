import { useState } from "react";
import { uploadDocument } from "../api/UploadApi";
export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus("Uploading...");

    try {
      const response = await uploadDocument(file);
      setUploadStatus(response);
    } catch (e) {
      setUploadStatus("Upload failed: " + e);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
        className="mr-2 p-2 border bg-gray-100 rounded w-60 inline-block hover:bg-gray-200 cursor-pointer"
      />
      <button
        onClick={handleUpload}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
      {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
    </div>
  );
}
