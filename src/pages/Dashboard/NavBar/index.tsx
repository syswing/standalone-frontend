import React from 'react'
import { Box, ListItemText } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton';
import * as colors from '@mui/material/colors';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useMatch,useResolvedPath } from 'react-router-dom'
import shadows from '@mui/material/styles/shadows';

const StyledListItemButton = styled(ListItemButton)<{ component?: React.ElementType, color: string,matched?:any }>(({ color,matched }) => {
	const matchedStyle = matched ? {
		color: '#fff',
		transform: 'translateX(-20px)',
		backgroundColor: colors[`${color}`][400],
		boxShadow: shadows[2],
	} : {}
	const styles = {
		transition: 'all ease .5s',
		...matchedStyle,
		'&:hover': {
			color: '#fff',
			transform: 'translateX(-20px)',
			backgroundColor: colors[`${color}`][400],
		},
		'& > a':{    
			textDecoration: 'none',
			color: 'currentColor'
		}
	}
	return styles
})

const MatchedLink = ({to,primary}) => {
	// 匹配子路由
	const match = useMatch({
		path:to,
		caseSensitive:false, // 大小写敏感
		end:false //是否全匹配
	})
	return <Link style={{
		textDecoration: 'none',
		color: 'currentColor',
		marginBottom:'20px'
	}} to={to}>
		<StyledListItemButton matched={match ? 1:0} color={'blue'}>
			<ListItemText
				sx={{ my: 0 }}
				primary={primary}
				primaryTypographyProps={{
					fontSize: 14,
					fontWeight: 'medium',
					letterSpacing: 0,
				}}
			/>
		</StyledListItemButton>
	</Link>
}

const NavBar = () => {

	// const match = useMatch('/about')

	// console.log('match',match)

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
			{/* <MatchedLink to={'/blog'} primary={'网志'}/> */}
			{/* <MatchedLink to={'/player'} primary={'播放器'}/> */}
			{/* <MatchedLink to={'/about'} primary={'关于我'}/> */}
			{/* <MatchedLink to={'/sakura'} primary={'樱花🌸'}/> */}
			{/* <MatchedLink to={'/study'} primary={'学习资料'}/> */}
		</Box>
	</ThemeProvider>
}

export default NavBar
