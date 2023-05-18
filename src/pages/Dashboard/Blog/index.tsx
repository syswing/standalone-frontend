import React, { useEffect } from 'react'
import action from '../../../request/action'
import { useDispatch, useSelector } from 'react-redux';
import { setBlogList } from '../../../store/blogList';
import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemText, Typography, Divider, Box } from '@mui/material';
import { useNavigate, useOutlet, Outlet } from 'react-router-dom'
import shadows from '@mui/material/styles/shadows';

const StyledListItem = styled(ListItem)<any>(() => {
	return {
		transition: 'all .5s ease',
		'&:hover': {
			boxShadow: shadows[3],
		},
	}
})

const Blog = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const outlet = useOutlet()

	const blogList = useSelector((state: any) => state.blogListReducer.blogList)

	console.log('blogList', blogList)

	useEffect(() => {
		const fetchArticleList = async () => {
			const result = await action({
				path: '/adventure/list',
			})
			dispatch(setBlogList(result.data))
		}
		fetchArticleList()
	}, [])

	return <>
		{outlet ? <Outlet/> : <List
			sx={{ width: '100%', bgcolor: 'background.paper' }}
		>
			{blogList.map(blog => {
				return <Box key={blog.ino}>
					<StyledListItem alignItems="flex-start" onClick={() => {
						navigate(`/blog/${blog.name}`, {
							replace: true, state: {
								path: blog.name
							}
						})
					}}>
						<ListItemText
							primary={blog.name.replace(/.md/g, '')}
							secondary={
								<React.Fragment>
									<Typography
										sx={{ display: 'inline' }}
										component="span"
										variant="body2"
										color="text.primary"
									>
										syswing
									</Typography>
									<span>{`发布于：${blog.create_at}`}</span>
								</React.Fragment>
							}
						/>
					</StyledListItem>
					{/* <Divider variant="middle" /> */}
				</Box>
			})}
		</List>}
	</>
}

export default Blog
