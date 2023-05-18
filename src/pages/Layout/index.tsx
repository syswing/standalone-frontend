import React from 'react'
import TopBar from './TopBar'
import { Box } from '@mui/system'
import { Avatar } from '@mui/material'
import AvatarImg from '@/images/WechatIMG115.jpeg'
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react'
import shadows from '@mui/material/styles/shadows';
import Dashboard from '../Dashboard'
import emotionStyled from '@emotion/styled'

const bounceOut = keyframes`
	0%{ box-shadow: ${shadows[2]}; transform: scale(1.1, 1.1);}
	25%{ box-shadow: ${shadows[3]}; transform: scale(0.9, 0.9);}
	50%{ box-shadow: ${shadows[4]}; transform: scale(1.2, 1.2); }
	75%{ box-shadow: ${shadows[5]}; transform: scale(1.1, 1.1);}
	100%{ box-shadow:${shadows[3]}; transform: scale(1, 1);}
`

const Quote = emotionStyled.i(({float}:any) => {
	return {
		wordBreak:'keep-all',
		fontWeight:'800',
		display:'inline-block',
		float:float||'left'
	}
})

const PositionDiv = (props) => {
	return <div className={props.className}>
		{props.children}
	</div>
}
const PositionDivWarp = styled(PositionDiv)<any>(({left,top,color}) => {
	return {
		position:'absolute',
    left: left,
    top: top,
    transform: 'translate(-50%,-50%)',
		color:color,

	}
})

const BounceAvatar = styled(Avatar)<any>(() => {
	return {
		'&:hover':{
			animation:`${bounceOut} .8s linear`
		}
	}
})

const Layout = () => {
	return <Box>
		<PositionDivWarp left={'50%'} top={'100px'}>
			<BounceAvatar sx={{ width: 88, height: 88 }} alt="syswing" src={AvatarImg} />
			<PositionDivWarp top={'150px'} left={'50%'} color={'white'}>
				<Quote>测试测试测试测试测试测试测试测试</Quote>
				<Quote float="right">----测试</Quote>
			</PositionDivWarp>
		</PositionDivWarp>
		<TopBar />
		<Dashboard />
	</Box>
}

export default Layout
