import React, { useEffect, useState } from 'react'
import { TextField, Button, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material'
import action from '../../../request/action'
import Paper from '@mui/material/Paper'

export default ({ children, blog }: any) => {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [nickname, setNickname] = useState('User') // Default nickname
  const [isNicknameDialogOpen, setIsNicknameDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Loading state for confirm button

  const fetchComments = async () => {
    const result = await action({
      path: '/comment/list',
      params: { reply: blog.id, page: 1, size: 10 },
    })
    setComments(result.data)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setIsNicknameDialogOpen(true) // Open the nickname confirmation dialog
  }

  const confirmAddComment = async () => {
    setIsLoading(true) // Start loading
    try {
      await action({
        path: '/comment/save',
        params: {
          reply: blog.id,
          content: newComment,
          email: 'user@example.com', // Replace with actual user email
          nickname: nickname, // Use the confirmed nickname
        },
      })
      setNewComment('')
      fetchComments()
    } finally {
      setIsLoading(false) // Stop loading
      setIsNicknameDialogOpen(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [blog.id])

  return (
    <div className="glass h-full justify-center items-center">
      {comments.length > 0 && (
        <List
          sx={{ width: '100%' }}
          className="pb-0"
        >
          {comments.map((comment, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={comment.nickname}
                  secondary={comment.content}
                  sx={{ wordBreak: 'break-word' }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
      <Paper
        component="form"
        className="glass p-3"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <TextField
          className='mr-3'
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="如何评价这篇内容？"
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
        >
          发送
        </Button>
      </Paper>

      {/* Nickname Confirmation Dialog */}
      <Dialog
        open={isNicknameDialogOpen}
        onClose={() => setIsNicknameDialogOpen(false)}
      >
        <DialogTitle>确认昵称</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="请输入昵称"
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNicknameDialogOpen(false)} color="secondary">
            取消
          </Button>
          <Button
            onClick={confirmAddComment}
            color="primary"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? <CircularProgress size={24} /> : '确认'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
