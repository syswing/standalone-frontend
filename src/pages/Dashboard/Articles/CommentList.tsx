import React, { useEffect, useState } from 'react'
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material'
import action from '../../../request/action'
import Paper from '@mui/material/Paper'

export default ({ children, blog }: any) => {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')

  const fetchComments = async () => {
    const result = await action({
      path: '/comment/list',
      params: { reply: blog.id, page: 1, size: 10 },
    })
    setComments(result.data)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    await action({
      path: '/comment/save',
      params: {
        reply: blog.id,
        content: newComment,
        email: 'user@example.com', // Replace with actual user email
        nickname: 'User', // Replace with actual user nickname
      },
    })
    setNewComment('')
    fetchComments()
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
    </div>
  )
}
