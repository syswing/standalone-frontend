import React from 'react'
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import {setSongInfo} from '../../store/currentMusic'
import { useDispatch } from 'react-redux';
import { blue } from '@mui/material/colors';

const PlayListItem = ({songInfo}:any) => {
	// '#03a9f4'
	const dispatch = useDispatch()
	console.log('renderPlayListItem')
	return <ListItem sx={{
		overflow:'hidden',
		'&:before':{
			content: "''",
			width: '200%',
			height: '200%',
			background: 'rgba(255, 255, 255, .2)',
			transform: 'rotate(-45deg)',
			position: 'absolute',
			top: '-10%',
			left: '-180%',	
			transition: '1.5s ease-in-out',
		},
		'&:hover': {
			bgcolor:  blue[400],
			color:'#fff',
			boxShadow:2,
			'& svg:first-of-type': {
				color:'#fff'
			},
			'&:before':{
				left:'60%'
			}
		},
	}} key={songInfo.songmid}>
		<ListItemText primary={`${songInfo.songname}`} />
		<ListItemIcon onClick={() => {
			dispatch(setSongInfo(songInfo))
			return 
		}}>
			<AudiotrackIcon sx={{
				cursor:'pointer'
			}}/>
		</ListItemIcon>
	</ListItem>
}

export default PlayListItem
