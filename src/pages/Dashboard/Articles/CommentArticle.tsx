import React, { useState } from 'react'
import CommentIcon from '@mui/icons-material/Comment'
import { IconButton, Typography } from '@mui/material'
import action from 'request/action'
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material'

export default (props:any) => {
  const { comment, id,showComments } = props

  const fetchComments = async () => {
    showComments()
  }
  
  return (
    <>
      <IconButton onClick={fetchComments}>
        <CommentIcon />
      </IconButton>
      <Typography>{comment}</Typography>
    </>
  )
}
