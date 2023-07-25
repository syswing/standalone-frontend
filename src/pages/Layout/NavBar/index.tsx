import React from 'react'
import { Box, Button, FormControlLabel, ListItemText, Stack, Switch } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton';
import * as colors from '@mui/material/colors';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useMatch,useResolvedPath } from 'react-router-dom'
import shadows from '@mui/material/styles/shadows';
import { frontPic, nextPic } from '../../../store/bingPic';
import { useDispatch } from 'react-redux';

const StyledListItemButton = styled(ListItemButton)<{ component?: React.ElementType, color: string,matched?:any }>(({ color,matched }) => {
	const matchedStyle = matched ? {
		color: '#fff',
		// transform: 'translateX(-20px)',
		backgroundColor: colors[`${color}`][400],
		boxShadow: shadows[2],
	} : {}
	const styles = {
		transition: 'all ease .5s',
		...matchedStyle,
		'&:hover': {
			color: '#fff',
			// transform: 'translateX(-20px)',
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

const NavBar = ({showTopBar,handleChangeShowTopBar}) => {
	const dispatch = useDispatch()
	return <ThemeProvider
		theme={createTheme({
			components: {
				MuiListItemButton: {
					defaultProps: {
						disableTouchRipple: true,
					},
				},
				MuiFormControlLabel:{
					styleOverrides:{
						label:{
							fontSize: '14px',
							fontWeight: 'medium',
							letterSpacing: 0,
						}
					}
				}
			},
		})}
	>
		<Stack direction="row" spacing={2}>
			<MatchedLink to={'/articles'} primary={'如是我闻'}/>
			<MatchedLink to={'/player'} primary={'念慈悲渡众生'}/>
			<MatchedLink to={'/about'} primary={'海的那边'}/>
			<MatchedLink to={'/sakura'} primary={'大江大河'}/>
			<MatchedLink to={'/study'} primary={'一见如故'}/>
		</Stack>
		<Stack direction="row" spacing={2} style={{
			marginLeft:'auto',
			marginRight:30
		}}>
			<FormControlLabel control={<Switch 
				checked={showTopBar}
				onChange={handleChangeShowTopBar}
			/>} label="动效开关" />
			<Button variant="contained" onClick={() => {
				dispatch(frontPic({}))
			}}>上一张图</Button>
			<Button variant="contained" onClick={() => {
				dispatch(nextPic({}))
			}}>下一张图</Button>
		</Stack>
	</ThemeProvider>
}

export default NavBar
