import React from 'react'
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import {setSongInfo} from '../../store/currentMusic'
import { useDispatch } from 'react-redux';

const PlayListItem = ({songInfo}:any) => {
	// '#03a9f4'
	const dispatch = useDispatch()
	console.log('renderPlayListItem')
	return <ListItem sx={{
		'&:hover, &:focus': {
			bgcolor:  '#cfe8fc',
			color:'#fff',
			boxShadow:2,
			'& svg:first-of-type': {
				// transform: 'translateX(-4px) rotate(-20deg)',
				color:'#fff'
			},
			'& svg:last-of-type': {
				// right: 0,
				// opacity: 1,
			},
		},
	}} key={songInfo.songmid}>
		<ListItemText  primary={`${songInfo.songname}`} />
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
