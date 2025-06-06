import React, { useState } from 'react';
import { streamDeepseekTest } from '../hooks/useApi';

const DeepseekChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      await streamDeepseekTest(
        input,
        (chunk) => {
          setResponse(prev => prev + chunk);
        },
        () => {
          setIsLoading(false);
        },
        (error) => {
          console.error('Error:', error);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Failed to get response:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="deepseek-chat">
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Deepseek something..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Send'}
        </button>
      </form>
      <div className="response">
        {response || (isLoading ? 'Waiting for response...' : 'Response will appear here')}
      </div>
    </div>
  );
};

export default DeepseekChat;