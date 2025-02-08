import { Chat } from "./components/Chat";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 ">
      <h1 className="text-2xl font-bold mb-4">Deepseeker-02</h1>
      <Chat />
    </div>
  );
}
