import React from 'react'
import { useSelector } from 'react-redux'

const MarkdownToc = () => {
	const currentBlog = useSelector((state:any) => state.currentBlogReducer.currentBlog)
	console.log('currentBlog',currentBlog)
	return <div style={{
		padding:20,
	}} dangerouslySetInnerHTML={{__html:currentBlog.tocContent}}></div>
}

export default MarkdownToc
