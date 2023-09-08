import React, { useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import action from '../../../request/action';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { pink } from '@mui/material/colors';

export default ({up,id}) => {
	const [isClicked,setIsClicked] = useState(false)
	const [curUp,setCurUp] = useState(up)

	return <>
		<IconButton onClick={async () => {
			if(!isClicked){
				const result = await action({
					path: "/adventure/up",
					params:{
						id:id
					}
				});
				setCurUp(up => up+1)
				setIsClicked(true)
			}
		}}>
			{isClicked ? <FavoriteIcon color={'secondary'}/> : <FavoriteBorderIcon color={'secondary'}/>}
		</IconButton>
		<Typography>{curUp}</Typography>
	</>
}
