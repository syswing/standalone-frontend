import React from 'react'
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import NavBar from './NavBar';
import PageContainer from './PageContainer'
import MarkdownToc from './MarkdownToc'
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useParams} from 'react-router-dom'

const Dashboard = () => {
	const currentBlog = useSelector((state:any) => state.currentBlogReducer.currentBlog)

	const { mdName } = useParams();

	return <Container sx={{
		marginTop:'80px',
	}}>
		<Grid container spacing={2}>
			<Grid item xs={2}>
	      <NavBar/>
	    </Grid>
	    <Grid item xs={7}>
	      <PageContainer element={<Outlet/>}/>
	    </Grid>
			<Grid item xs={3}>
				{mdName && <MarkdownToc/> }
	    </Grid>
		</Grid>
	</Container>
}

export default Dashboard
