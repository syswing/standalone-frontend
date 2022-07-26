import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import action from '../../../request/action';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import PlayListItem from '../../../components/PlayListItem'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

const Songlist = () => {
	const params = useParams();
	const [listInfo, setListInfo] = useState<any>({})
	const currentMusic = useSelector((state: any) => state.currentMusicReducer.currentMusic)

	useEffect(() => {
		const fetchSongList = async () => {
			const result = await action({
				path: '/QQMusic/songlist',
				params: {
					id: params.listId
				}
			})
			setListInfo(result.data)
		}
		fetchSongList()
	}, [])
	return <><Grid item xs={8}>
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
	</Grid><Box sx={{
		overflow: 'scroll',
		maxHeight: '400px'
	}}>
			<List>
				{listInfo?.songlist?.map((songInfo: any) => {
					return <PlayListItem key={songInfo.songid} songInfo={songInfo} />
				})}
			</List>
		</Box></>
}

export default Songlist
