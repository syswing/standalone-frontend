import React, { useEffect,useState } from 'react'
import { useParams } from "react-router-dom";
import action from '../../../request/action';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import PlayListItem from '../../../components/PlayListItem'

const Songlist = () => {
	const params = useParams();
	const [listInfo ,setListInfo] = useState<any>({})
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
	},[])
	return <Box sx={{
		overflow: 'scroll',
		maxHeight: '400px'
	}}>
		<List>
			{listInfo?.songlist?.map((songInfo:any) => {
				return <PlayListItem key={songInfo.songid} songInfo={songInfo}/>
			})}
		</List>
	</Box>
}

export default Songlist
