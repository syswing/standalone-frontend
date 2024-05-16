import React from 'react'
import Container from '@mui/material/Container';
import PageContainer from './PageContainer'
import { Outlet } from 'react-router-dom';

const Dashboard = () => {

	return <div  style={{
		position: 'absolute',
		top: '64px',
		width: '100%',
		overflowY:'auto'
	}}><PageContainer element={<Outlet/>}/></div>
}

export default Dashboard
 