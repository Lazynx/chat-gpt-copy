'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const webSocket = new WebSocket(url);

    webSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    webSocket.onmessage = (event) => {
      const data = event.data; // Получаем данные как текст
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    webSocketRef.current = webSocket;

    return () => {
      webSocket.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  };

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, sendMessage, clearMessages };
};

export default useWebSocket;
