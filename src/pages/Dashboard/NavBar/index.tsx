import React from 'react'
import { Box, ListItemText } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton';
import * as colors from '@mui/material/colors';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom'
import shadows from '@mui/material/styles/shadows';

const StyledListItemButton = styled(ListItemButton)<{ component?: React.ElementType, color: string }>(({ color }) => {
	return {
		borderRadius: '11px',
		transition: 'all ease .5s',
		'&:hover': {
			color: '#fff',
			transform: 'translateX(-20px)',
			backgroundColor: colors[`${color}`][400],
			boxShadow: shadows[2]
		},
		'& > a':{    
			textDecoration: 'none',
			color: 'currentColor'
		}
	}
})

const NavBar = () => {

	const location = useLocation();

	console.log('location',location)

	return <ThemeProvider
		theme={createTheme({
			components: {
				MuiListItemButton: {
					defaultProps: {
						disableTouchRipple: true,
					},
				},
			},
		})}
	>
		<Box sx={{
			height:"100vh"
		}}>
			<Link style={{
				textDecoration: 'none',
				color: 'currentColor'
			}} to={'/blog'}>
				<StyledListItemButton color={'blue'}>
					<ListItemText
						sx={{ my: 0 }}
						primary={'日志'}
						primaryTypographyProps={{
							fontSize: 14,
							fontWeight: 'medium',
							letterSpacing: 0,
						}}
					/>
				</StyledListItemButton>
			</Link>
			<Link style={{
				textDecoration: 'none',
				color: 'currentColor'
			}} to={'/about'}>
				<StyledListItemButton color={'blue'}>
					<ListItemText
						sx={{ my: 0 }}
						primary={'关于我'}
						primaryTypographyProps={{
							fontSize: 14,
							fontWeight: 'medium',
							letterSpacing: 0,
						}}
					/>
				</StyledListItemButton>
			</Link>

		</Box>
	</ThemeProvider>
}

export default NavBar
