'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useWebSocket from '@/lib/hooks/useWebsocket';
import { useEffect, useState, useRef } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

export default function Home() {
  const { messages, sendMessage, clearMessages } = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (prompt.trim() !== '') {
      const userMessage = { text: prompt, isUser: true };
      setChatMessages((prevMessages) => [...prevMessages, userMessage, { text: '', isUser: false }]);
      sendMessage(prompt);
      setPrompt('');
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      setChatMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].text = latestMessage;
        }
        return newMessages;
      });
      clearMessages();
    }
  }, [messages, clearMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold">Chat with GPT via WebSockets</h1>
      </header>
      <main className="flex-1 py-12 px-4 md:px-6 flex flex-col justify-end">
        <div className="flex-1 overflow-y-auto mb-8 space-y-4 p-4 bg-white rounded-lg shadow">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg p-4 rounded-lg shadow ${
                  message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <Button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Send
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
