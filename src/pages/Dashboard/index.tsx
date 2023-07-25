import React from 'react'
import Container from '@mui/material/Container';
import PageContainer from './PageContainer'
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
	return <Container fixed sx={{
		marginTop:'80px',
		paddingBottom:'20px'
	}}>
	  <PageContainer element={<Outlet/>}/>
	</Container>
}

export default Dashboard
