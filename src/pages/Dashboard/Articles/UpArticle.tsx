import React, { useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import action from '../../../request/action';


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
			{isClicked ? <ThumbUpAltIcon/> : <ThumbUpOffAltIcon/>}
		</IconButton>
		<Typography>{curUp}</Typography>
	</>
}
