import React from 'react'
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import NavBar from './NavBar';
import PageContainer from './PageContainer'
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
	return <Container sx={{
		// maxHeight:'calc( 100vh - 160px )',
		marginTop:'80px',
		// marginBottom:'80px',
	}}>
		<Grid container spacing={2}>
			<Grid item xs={4}>
	      <NavBar/>
	    </Grid>
	    <Grid item xs={8}>
	      <PageContainer element={<Outlet/>}/>
	    </Grid>
		</Grid>
	</Container>
}

export default Dashboard
