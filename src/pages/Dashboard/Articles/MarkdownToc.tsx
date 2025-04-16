import React from 'react'
import { useSelector } from 'react-redux'

const MarkdownToc = () => {
	const currentBlog = useSelector((state:any) => state.currentBlogReducer.currentBlog)
	return <div className="markdown-toc glass rounded-md" style={{
		padding:20,
	}} dangerouslySetInnerHTML={{__html:currentBlog.tocContent}}></div>
}

export default MarkdownToc
