
import React, { useState } from 'react'
import CommentIcon from '@mui/icons-material/Comment';
import { IconButton, Typography } from '@mui/material'
import action from 'request/action';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'

export default ({comment,id}) => {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const fetchComments = async () => {
    const result = await action({
      path: '/comment/list',
      params: { articleId: id, page: 1, size: 10 },
    })
    setComments(result.data)
    setShowComments(true)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    await action({
      path: '/comment/save',
      params: {
        articleId: id,
        content: newComment,
        email: 'user@example.com', // Replace with actual user email
        nickname: 'User', // Replace with actual user nickname
      },
    })
    setNewComment('')
    fetchComments()
  }
	return <>
		<IconButton onClick={fetchComments}>
      <CommentIcon />
		</IconButton>
		<Typography>{comment}</Typography>
    {showComments && (
        <div>
          <List>
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
          <TextField
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            variant="outlined"
            size="small"
            style={{ marginTop: '10px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            style={{ marginTop: '10px' }}
          >
            Submit
          </Button>
        </div>
      )}
	</>
}
