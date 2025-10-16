"use client";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isBot ? "bg-gray-700 text-white" : "bg-teal-600 text-white"
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
