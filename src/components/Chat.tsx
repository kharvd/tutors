// Chatbox.tsx
import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "assistant" | "system"; 
  content: string;
}

interface ChatboxProps {
  messages: Message[];
  onSendMessage: (message: Message) => void;
  quiz: Quiz | null; // Add the quiz prop to the ChatboxProps interface
}

const Chatbox = ({ onSendMessage, messages, quiz }: ChatboxProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("quiz is");
    console.log(quiz);
  
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage: Message = {
        sender: "user",
        content: inputMessage,
      };
      onSendMessage(userMessage);
  
      // Update the system message content with the stringified quiz object
      let updatedMessages = [...messages, userMessage];
      if (quiz) {
        const stringifiedQuiz = JSON.stringify(quiz, null, 2);
        updatedMessages = updatedMessages.map((message) => {
          if (message.sender === "system") {
            return {
              ...message,
              content: stringifiedQuiz,
            };
          }
          return message;
        });
      }
  
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
  
      if (response.ok) {
        const responseBody = await response.json(); // Parse the JSON response
        const assistantMessageText = responseBody.content; // Access the content property
        const assistantMessage: Message = {
          sender: "assistant",
          content: assistantMessageText,
        };
        onSendMessage(assistantMessage);
      }
  
      setInputMessage("");
    }
  };  

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === "user" ? "text-right" : ""
            } text-sm`}
          >
            <span>{message.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 flex-shrink-0"
      >
        <div className="flex">
          <input
            type="text"
            placeholder="Type your message"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-indigo-500"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-r hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;
