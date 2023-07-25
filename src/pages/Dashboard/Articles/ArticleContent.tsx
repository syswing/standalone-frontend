import { Paper } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import 'github-markdown-css'
export default () => {
	const currentBlog = useSelector((state:any) => state.currentBlogReducer.currentBlog)

	return <Paper elevation={4}><div style={{
		padding:20,
		marginBottom:20
	}} dangerouslySetInnerHTML={{__html:currentBlog.md}}></div></Paper>
}
