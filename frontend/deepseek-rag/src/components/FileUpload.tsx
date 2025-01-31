// components/FileUpload.tsx
import { useState } from "react";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading:", file.name);
      // Implement upload logic here
    }
  };

  return (
    <div className="mb-4">
      <input type="file" onChange={handleFileChange} className="mr-2 p-2 border bg-gray-100 rounded w-60 inline-block hover:bg-gray-200 cursor-pointer" />
      <button
        onClick={handleUpload}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
}
