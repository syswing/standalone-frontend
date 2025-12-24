import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  Container,
  Divider,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import useSnackbar from '../../components/SnackbarProvider/useSnackbar'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isSelf: boolean
}

interface Client {
  id: string
  username: string
}

export default () => {
  const { showSnackbar } = useSnackbar()
  const socketRef = useRef<Socket | null>(null)
  const [mySocketId, setMySocketId] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [username, setUsername] = useState<string>('用户' + Math.floor(Math.random() * 1000))
  const [room, setRoom] = useState<string>('room1')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 初始化 Socket.IO 连接
  useEffect(() => {
    // 创建 socket 连接
    socketRef.current = io('http://localhost:3000/p2p', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    const socket = socketRef.current

    // 连接成功
    socket.on('connect', () => {
      console.log('已连接到服务器:', socket.id)
      setMySocketId(socket.id || '')
      setIsConnected(true)
      showSnackbar('连接成功！', 'success')

      // 加入房间
      socket.emit('joinRoom', { room, username })
    })

    // 接收欢迎消息
    socket.on('welcome', (data) => {
      console.log('欢迎消息:', data)
      showSnackbar(data.message || '欢迎加入聊天室', 'info')
    })

    // 接收消息
    socket.on('message', (data) => {
      console.log('收到消息:', data)
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: data.username || data.sender || 'Unknown',
        content: data.content,
        timestamp: new Date(data.timestamp || Date.now()),
        isSelf: data.socketId === socket.id,
      }
      setMessages((prev) => [...prev, newMessage])
    })

    // 获取客户端列表
    socket.on('clientsList', (data) => {
      console.log('在线客户端:', data)
      setClients(data.clients || [])
    })

    // 用户加入房间通知
    socket.on('userJoined', (data) => {
      console.log('用户加入:', data)
      showSnackbar(`${data.username} 加入了房间`, 'info')
      // 请求更新客户端列表
      socket.emit('getClients', { room })
    })

    // 用户离开房间通知
    socket.on('userLeft', (data) => {
      console.log('用户离开:', data)
      showSnackbar(`${data.username} 离开了房间`, 'warning')
      // 请求更新客户端列表
      socket.emit('getClients', { room })
    })

    // 断开连接
    socket.on('disconnect', (reason) => {
      console.log('已断开连接:', reason)
      setIsConnected(false)
      showSnackbar('连接已断开', 'error')
    })

    // 连接错误
    socket.on('connect_error', (error) => {
      console.error('连接错误:', error)
      showSnackbar('连接失败，请检查服务器是否运行', 'error')
    })

    // 重连成功
    socket.on('reconnect', (attemptNumber) => {
      console.log('重连成功，尝试次数:', attemptNumber)
      showSnackbar('重新连接成功', 'success')
      setIsConnected(true)
      // 重新加入房间
      socket.emit('joinRoom', { room, username })
    })

    // 清理函数
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [room, username])

  // 发送消息
  const sendMessage = () => {
    if (!message.trim()) return

    if (!isConnected) {
      showSnackbar('未连接到服务器', 'warning')
      return
    }

    const messageData = {
      content: message,
      username: username,
      room: room,
      timestamp: new Date(),
    }

    socketRef.current?.emit('message', messageData)

    // 添加到本地消息列表（如果服务器不回传自己的消息）
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: username,
      content: message,
      timestamp: new Date(),
      isSelf: true,
    }
    setMessages((prev) => [...prev, newMessage])
    setMessage('')
  }

  // 复制ID到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mySocketId)
    showSnackbar('ID已复制到剪贴板', 'success')
  }

  // 获取客户端列表
  const refreshClients = () => {
    socketRef.current?.emit('getClients', { room })
  }

  // 加入房间
  const joinRoom = () => {
    if (!room.trim()) {
      showSnackbar('请输入房间名称', 'warning')
      return
    }
    socketRef.current?.emit('joinRoom', { room, username })
    showSnackbar(`正在加入房间: ${room}`, 'info')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          💬 Socket.IO 聊天室
        </Typography>

        <Box sx={{ mb: 2, p: 2, backgroundColor: isConnected ? 'success.light' : 'error.light', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {isConnected ? '✅ 已连接到服务器' : '❌ 未连接到服务器'}
          </Typography>
        </Box>

        {/* 用户信息区域 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="你的昵称"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              sx={{ width: 200 }}
              disabled={isConnected}
            />
            <Chip
              label={`Socket ID: ${mySocketId || '未连接'}`}
              color={isConnected ? 'primary' : 'default'}
              icon={<Avatar sx={{ width: 24, height: 24 }}>{username.charAt(0)}</Avatar>}
            />
            <IconButton onClick={copyToClipboard} disabled={!mySocketId} color="primary" size="small">
              <ContentCopyIcon />
            </IconButton>
          </Box>

          {/* 房间区域 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="房间名称"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="输入房间名称"
              size="small"
              sx={{ width: 200 }}
              disabled={isConnected}
            />
            <Button variant="contained" onClick={joinRoom} disabled={isConnected || !room.trim()}>
              加入房间
            </Button>
            <Button variant="outlined" onClick={refreshClients} disabled={!isConnected}>
              刷新在线列表
            </Button>
          </Box>
        </Box>

        {/* 在线用户 */}
        {clients.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              在线用户 ({clients.length}):
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {clients.map((client) => (
                <Chip
                  key={client.id}
                  label={client.username || client.id}
                  size="small"
                  color={client.id === mySocketId ? 'primary' : 'success'}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 消息列表 */}
        <Paper
          elevation={0}
          sx={{
            height: 400,
            overflowY: 'auto',
            p: 2,
            mb: 2,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                💬
              </Typography>
              <Typography variant="body2" color="text.secondary">
                暂无消息，开始聊天吧！
              </Typography>
            </Box>
          ) : (
            <List>
              {messages.map((msg) => (
                <ListItem
                  key={msg.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: msg.isSelf ? 'flex-end' : 'flex-start',
                    mb: 1,
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      bgcolor: msg.isSelf ? 'primary.light' : 'grey.100',
                      p: 1.5,
                      borderRadius: 2,
                      wordBreak: 'break-word',
                    }}
                  >
                    {!msg.isSelf && (
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {msg.sender}
                      </Typography>
                    )}
                    <Typography variant="body2">{msg.content}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Paper>

        {/* 消息输入框 */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="输入消息..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            multiline
            rows={2}
            disabled={!isConnected}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!isConnected || !message.trim()}
            endIcon={<SendIcon />}
          >
            发送
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
