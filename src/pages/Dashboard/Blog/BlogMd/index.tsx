import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import action from '../../../../request/action'
import * as ReactDOMServer from 'react-dom/server';
import { setBlogMd } from '../../../../store/currentBlog';

const BlogMd = () => {
	const location = useLocation() as any
	const dispatch = useDispatch()
	const path = location?.state?.path
	const currentBlog = useSelector((state:any) => state.currentBlogReducer.currentBlog)
		useEffect(() => {
		const fetchBlogMd = async (path) => {
			const result = await action({
				path:'/adventure/read',
				params:{
					filePath:path
				}
			})
			dispatch(setBlogMd(result.data))
		}
		if(path){
			fetchBlogMd(path)
		}
		return () => {
			dispatch(setBlogMd({}))
		}
	},[path])
	return <div style={{
		padding:20
	}} dangerouslySetInnerHTML={{__html:currentBlog.dom}}></div>
}

export default BlogMd
