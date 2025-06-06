import React, { useState, useRef, useEffect } from 'react';
import { streamDeepseekTest } from '../hooks/useApi';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Container, 
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

// 自定义样式组件
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%', // 使用 100% 而不是 100vh，以适应父容器
  overflow: 'hidden',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const InputContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'transparent',
  zIndex: 1,
  width: '100%',
}));

const MessageBubble = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  maxWidth: '80%',
  borderRadius: theme.spacing(2),
}));

const UserMessage = styled(MessageBubble)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  alignSelf: 'flex-end',
  borderBottomRightRadius: theme.spacing(0.5),
}));

const AIMessage = styled(MessageBubble)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  alignSelf: 'flex-start',
  borderBottomLeftRadius: theme.spacing(0.5),
}));

const DeepseekChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    
    // 添加用户消息
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    // 添加一个空的AI消息，用于流式更新
    setMessages(prev => [...prev, { type: 'ai', content: '' }]);
    
    try {
      let aiResponse = '';
      
      await streamDeepseekTest(
        userMessage,
        (chunk) => {
          aiResponse += chunk;
          // 更新最后一条消息（AI的回复）
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { 
              type: 'ai', 
              content: aiResponse 
            };
            return newMessages;
          });
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
    <ChatContainer>
      <MessagesContainer ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="100%"
          >
            <Typography variant="h5" color="textSecondary" gutterBottom>
              欢迎使用deepseek 
            </Typography>
            <Typography variant="body1" color="textSecondary">
              您可以向deepseek提问
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column">
            {messages.map((message, index) => (
              message.type === 'user' ? (
                <UserMessage key={index} elevation={1}>
                  <Typography>{message.content}</Typography>
                </UserMessage>
              ) : (
                <AIMessage key={index} elevation={1}>
                  <ReactMarkdown>{message.content || '思考中...'}</ReactMarkdown>
                </AIMessage>
              )
            ))}
          </Box>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer elevation={3} className='glass'>
        <form onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="向deepseek提问"
              disabled={isLoading}
              variant="outlined"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Box ml={1}>
              <IconButton 
                color="primary" 
                type="submit" 
                disabled={isLoading || !input.trim()}
                size="large"
              >
                {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </form>
      </InputContainer>
    </ChatContainer>
  );
};

export default DeepseekChat;