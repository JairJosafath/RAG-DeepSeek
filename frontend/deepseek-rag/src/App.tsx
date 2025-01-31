import { Chat } from "./components/Chat";
import { FileUpload } from "./components/FileUpload";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 ">
      <h1 className="text-2xl font-bold mb-4">Deepseeker</h1>
      <FileUpload />
      <Chat />
    </div>
  );
}
