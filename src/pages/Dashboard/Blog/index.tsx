import React, { useEffect } from 'react'
import action from '../../../request/action'

const Blog = () => {
	useEffect(() => {
		const fetchArticleList = async () => {
			const result = await action({
				path: '/adventure/scan',
			})
			console.log(result.data)
		}
		fetchArticleList()
	}, [])
	return <>blog</>
}

export default Blog
