import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import action from '../../request/action';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import People from '@mui/icons-material/People';
import PermMedia from '@mui/icons-material/PermMedia';
import Dns from '@mui/icons-material/Dns';
import Public from '@mui/icons-material/Public';
import Divider from '@mui/material/Divider';
import Favorite from '@mui/icons-material/Favorite';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Settings from '@mui/icons-material/Settings';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import ListIcon from '@mui/icons-material/List';
import MusicPlayer from '../../components/MusicPlayer';

// 播放器主界面

const Item = styled(Paper)(({ theme }: any) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	padding: theme.spacing(1),
	// ...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
	borderRadius: 0,
}));

const buttons = [
	<Button key="one">One</Button>,
	<Button key="two">Two</Button>,
	<Button key="three">Three</Button>,
];

const data = [
	{ icon: <People />, label: 'Authentication' },
	{ icon: <Dns />, label: 'Database' },
	{ icon: <PermMedia />, label: 'Storage' },
	{ icon: <Public />, label: 'Hosting' },
];

const UserNav = styled(List)<{ component?: React.ElementType }>({
	'& .MuiListItemButton-root': {
		paddingLeft: 24,
		paddingRight: 24,
	},
	'& .MuiListItemIcon-root': {
		minWidth: 0,
		marginRight: 16,
	},
	'& .MuiSvgIcon-root': {
		fontSize: 20,
	},
});

const UserInfo = () => {
	const [userInfoData, setUserInfoData] = useState<any>({})
	const navigate = useNavigate()

	const [open, setOpen] = useState(true)

	const [currentSong, setCurrentSong] = useState<any>({})

	useEffect(() => {
		const fetchUserInfo = async () => {
			const result = await action({
				path: '/QQMusic/userDetail',
				params: {
					qqNo: '1102977704'
				}
			})
			setUserInfoData(result.data)
		}
		fetchUserInfo()
	}, [])


	return <ThemeProvider
		theme={createTheme({
			components: {
				MuiListItemButton: {
					defaultProps: {
						disableTouchRipple: true,
					},
				},
			},
			palette: {
				// mode: 'dark',
				// primary: { main: 'rgb(102, 157, 246)' },
				// background: { paper: 'rgb(5, 30, 52)' },
			},
		})}
	>
		<Box sx={{
			boxShadow: 2,
			padding: '10px',
			width: '90%',
			margin: '40px'
		}}>
			<Grid container spacing={0}>
				<Grid item xs={2}>

					<Paper elevation={0} sx={{ maxWidth: 256 }}>
						<UserNav component="nav" disablePadding>
							<ListItemButton component="a" onClick={() => {
								navigate(`/userinfo/info`, {
									replace: true
								});
							}}>
								<ListItemIcon sx={{ fontSize: 20 }}>
									<Avatar src={userInfoData?.creator?.headpic} />
								</ListItemIcon>
								<ListItemText
									sx={{ my: 0 }}
									primary={userInfoData?.creator?.nick}
									primaryTypographyProps={{
										fontSize: 20,
										fontWeight: 'medium',
										letterSpacing: 0,
									}}
								/>
							</ListItemButton>
							<Divider />
							<ListItemButton
								onClick={() => {
									navigate(`/userinfo/songlist/${userInfoData?.mymusic && userInfoData?.mymusic[0]?.id}`, {
										replace: true
									});
								}}
							>
								<ListItemIcon>
									<Favorite color="primary" />
								</ListItemIcon>
								<ListItemText
									sx={{ my: 0 }}
									primary={userInfoData?.mymusic && userInfoData?.mymusic[0]?.title}
									primaryTypographyProps={{
										fontSize: 14,
										fontWeight: 'medium',
										letterSpacing: 0,
									}}
								/>
							</ListItemButton>
							<Divider />
							<ListItemButton
								onClick={() => {
									navigate(`/userinfo/songlist/${userInfoData?.mymusic && userInfoData?.mymusic[0]?.id}`, {
										replace: true
									});
								}}
							>
								<ListItemIcon>
									<ListIcon color="primary" />
								</ListItemIcon>
								<ListItemText
									sx={{ my: 0 }}
									primary={userInfoData?.mydiss && userInfoData?.mydiss?.title}
									primaryTypographyProps={{
										fontSize: 14,
										fontWeight: 'medium',
										letterSpacing: 0,
									}}
								/>
							</ListItemButton>
						</UserNav>
					</Paper>
				</Grid>
				<Grid item xs={10}>
					<MusicPlayer />
					<Outlet />
				</Grid>
			</Grid>
		</Box>
	</ThemeProvider>

}

export default UserInfo
