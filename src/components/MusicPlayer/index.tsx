import React from 'react'
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import {useSelector} from 'react-redux'
import action from '../../request/action';

const TinyText = styled(Typography)({
	fontSize: '0.75rem',
	opacity: 0.38,
	fontWeight: 500,
	letterSpacing: 0.2,
});

const MusicPlayer = () => {

	const [position, setPosition] = React.useState(32); 																				// 播放的位置
	const [ audioUrl,setAudioUrl ] = React.useState< string | undefined>(undefined)							// 音频地址
	const [paused, setPaused] = React.useState(true);																						// 是否是暂停状态

	const currentMusic = useSelector((state:any) => state.currentMusicReducer.currentMusic)

	const duration = 200; // seconds
	const theme = useTheme();
	const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
	const lightIconColor =
		theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';


	function formatDuration(value: number) {
		const minute = Math.floor(value / 60);
		const secondLeft = value - minute * 60;
		return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
	}

	const play = async () => {
		console.log(currentMusic)
		console.log('play')
		const dataUrl = await action({
			path:'/QQMusic/songurl',
			params:{
				songmid:currentMusic.songmid
			}
		})
		setAudioUrl(dataUrl.data[currentMusic.songmid])
		setPosition(0)
	}

	const pause = () => {
		console.log('pause')
	}

	return <Box mt={2}>
		<audio src={audioUrl} autoPlay/> 
		<Box sx={{ ml: 1.5, minWidth: 0 }}>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<Typography variant="caption" color="text.secondary" fontWeight={500}>
						{currentMusic?.albumdesc}
					</Typography>
					<Typography noWrap>
						<b>{currentMusic?.albumname}</b>
					</Typography>
					<Typography noWrap letterSpacing={-0.25}>
						{currentMusic?.songname} &mdash; {currentMusic?.singer?.map(singerItem => {
							return singerItem.name + ' '
						})}
					</Typography>
				</Grid>
				<Grid item xs={4}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mt: -1,
						}}
					>
						<IconButton aria-label="previous song">
							<FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
						</IconButton>
						<IconButton
							aria-label={paused ? 'play' : 'pause'}
							onClick={() => {
								paused ? play() : pause()
								setPaused(!paused)
							}}
						>
							{paused ? (
								<PlayArrowRounded
									sx={{ fontSize: '3rem' }}
									htmlColor={mainIconColor}
								/>
							) : (
								<PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
							)}
						</IconButton>
						<IconButton aria-label="next song">
							<FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
						</IconButton>
					</Box>
				</Grid>
			</Grid>

		</Box>
		<Box sx={{
			padding: '0 20px'
		}}>
			<Slider
				aria-label="time-indicator"
				size="small"
				value={position}
				min={0}
				step={1}
				max={duration}
				onChange={(_, value) => setPosition(value as number)}
				sx={{
					color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
					height: 4,
					'& .MuiSlider-thumb': {
						width: 8,
						height: 8,
						transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
						'&:before': {
							boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
						},
						'&:hover, &.Mui-focusVisible': {
							boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
								? 'rgb(255 255 255 / 16%)'
								: 'rgb(0 0 0 / 16%)'
								}`,
						},
						'&.Mui-active': {
							width: 20,
							height: 20,
						},
					},
					'& .MuiSlider-rail': {
						opacity: 0.28,
					},
				}}
			/>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mt: -2,
				}}
			>
				<TinyText>{formatDuration(position)}</TinyText>
				<TinyText>-{formatDuration(duration - position)}</TinyText>
			</Box>
		</Box>


		{/* <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
			<VolumeDownRounded htmlColor={lightIconColor} />
			<Slider
				aria-label="Volume"
				defaultValue={30}
				sx={{
					color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
					'& .MuiSlider-track': {
						border: 'none',
					},
					'& .MuiSlider-thumb': {
						width: 24,
						height: 24,
						backgroundColor: '#fff',
						'&:before': {
							boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
						},
						'&:hover, &.Mui-focusVisible, &.Mui-active': {
							boxShadow: 'none',
						},
					},
				}}
			/>
			<VolumeUpRounded htmlColor={lightIconColor} />
		</Stack> */}
	</Box>
}

export default MusicPlayer
